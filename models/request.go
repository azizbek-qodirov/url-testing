package models

type RequestModel struct {
	URL       string            `json:"url"`
	Method    string            `json:"method"`
	Body      string            `json:"body"`
	Headers   map[string]string `json:"headers"`
	ReqCount  int               `json:"req_count"`
	CReqCount int               `json:"c_req_count"`
}
