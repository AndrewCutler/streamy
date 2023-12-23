package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	http.Handle("/", handlers())
	http.ListenAndServe(":8000", nil)
}

func handlers() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", index).Methods("GET")
	// router.HandleFunc("/save", saveWebmToLocalFile).Methods("POST")

	return router
}

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Println("INDEX")
	wd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(wd)
	fmt.Println("INDEX4")
	http.ServeFile(w, r, "index.html")
}

func saveWebmToLocalFile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("could not read request body")
	}
	fmt.Println(body)
}
