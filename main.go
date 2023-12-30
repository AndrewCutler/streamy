package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/pion/webrtc/v4"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/save", saveWebmToLocalFile)
	http.ListenAndServe(":8000", nil)

	m := webrtc.MediaEngine{}

	// VP8
	if err := m.RegisterCodec(webrtc.RTPCodecParameters{
		RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeVP8, ClockRate: 90000, Channels: 0, SDPFmtpLine: "", RTCPFeedback: nil},
		PayloadType:        96,
	}, webrtc.RTPCodecTypeVideo); err != nil {
		panic(err)
	}
	// Opus
	// if err := m.RegisterCodec(webrtc.RTPCodecParameters{
	// 	RTPCodecCapability: webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus, ClockRate: 48000, Channels: 0, SDPFmtpLine: "", RTCPFeedback: nil},
	// 	PayloadType:        111,
	// }, webrtc.RTPCodecTypeAudio); err != nil {
	// 	panic(err)
	// }

	api := webrtc.NewAPI(webrtc.WithMediaEngine(&m), nil /* webrtc.WithInterceptorRegistry(i) */)

	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}
}

func saveWebmToLocalFile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("could not read request body")
	}
	if err := os.WriteFile("test.webm", body, 0600); err != nil {
		log.Fatal(err)
	}
	fmt.Println(body)
}
