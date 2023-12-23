package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	http.Handle("/", handlers())
	http.ListenAndServe(":8000", nil)
}

func handlers() *mux.Router {
	router := mux.NewRouter()
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("")))
	router.HandleFunc("/save", saveWebmToLocalFile).Methods("POST")

	return router
}

func index(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("C:\\Users\\spyro\\Apps\\streamy"))
}

func saveWebmToLocalFile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("could not read request body")
	}
	fmt.Println(body)
}
