package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/save", saveWebmToLocalFile)
	http.ListenAndServe(":8000", nil)
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
