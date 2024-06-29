package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
	"url-tester/models"
)

func performLoadTest(reqModels []*models.RequestModel) []models.TestResult {
	var results []models.TestResult

	for _, reqModel := range reqModels {
		successfulRequests, failedRequests, duration, logs := performSingleLoadTest(reqModel)
		result := models.TestResult{
			Method:             reqModel.Method,
			URL:                reqModel.URL,
			SuccessfulRequests: successfulRequests,
			FailedRequests:     failedRequests,
			Time:               duration.Seconds(),
			Logs:               string(logs),
		}
		results = append(results, result)
	}

	return results
}

func performSingleLoadTest(reqModel *models.RequestModel) (int, int, time.Duration, []byte) {
	var logs []byte
	var wg sync.WaitGroup
	ch := make(chan int, reqModel.ReqCount)
	client := &http.Client{Timeout: 10 * time.Second}
	start := time.Now()

	for i := 0; i < reqModel.ReqCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			req, err := http.NewRequest(reqModel.Method, reqModel.URL, bytes.NewBuffer([]byte(reqModel.Body)))
			if err != nil {
				logs = append(logs, []byte(fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error creating request: nil <br>", reqModel.Method, 0, reqModel.URL))...)
				ch <- 0
				return
			}

			for key, value := range reqModel.Headers {
				req.Header.Set(key, value)
			}

			resp, err := client.Do(req)
			if err != nil {
				fmt.Println(resp, reqModel)
				if resp != nil && reqModel != nil {
					logs = append(logs, []byte(fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error performing request: nil <br>", reqModel.Method, resp.StatusCode, reqModel.URL))...)
				} else {

					logs = append(logs, []byte(fmt.Sprintln("Goroutine error: Invalid memory address or nil pointer dereference"))...)
				}
				ch <- 0
				return
			}
			defer resp.Body.Close()

			if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				res := fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error: nil <br>", reqModel.Method, resp.StatusCode, reqModel.URL)
				logs = append(logs, []byte(res)...)
				ch <- 1
			} else {
				body, err := io.ReadAll(resp.Body)
				if err != nil {
					logs = append(logs, []byte(fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error reading response body: nil <br>", reqModel.Method, resp.StatusCode, reqModel.URL))...)
					ch <- 0
					return
				}
				type ErrResp struct {
					Error   string `json:"error"`
					Details string `json:"details"`
				}
				var errResp ErrResp
				err = json.Unmarshal(body, &errResp)
				if err != nil {
					logs = append(logs, []byte(fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error unmarshalling response: nil <br>", reqModel.Method, resp.StatusCode, reqModel.URL))...)
					ch <- 0
					return
				}
				bodyText := errResp.Error + " " + errResp.Details
				res := fmt.Sprintf("%s &emsp;&emsp; %d &emsp;&emsp; %s &emsp;&emsp;Error: %s <br>", reqModel.Method, resp.StatusCode, reqModel.URL, bodyText)
				logs = append(logs, []byte(res)...)
				ch <- 0
			}
		}()

		if (i+1)%reqModel.CReqCount == 0 {
			wg.Wait()
		}
	}

	wg.Wait()
	close(ch)

	successfulRequests := 0
	failedRequests := 0
	for status := range ch {
		if status == 1 {
			successfulRequests++
		} else {
			failedRequests++
		}
	}
	dur := time.Since(start)
	return successfulRequests, failedRequests, dur, logs
}
