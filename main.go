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
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("")))
	router.HandleFunc("/", index).Methods("GET")
	router.HandleFunc("/save", saveWebmToLocalFile).Methods("POST")

	return router
}

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Println("INDEX")
	entries, err := os.ReadDir("C:\\Users\\spyro\\Apps\\streamy")
	if err != nil {
		fmt.Println(err)
	}

	for _, entry := range entries {
		fmt.Println(entry.Name())
	}

	// filepath.Walk("/", func(path string, info os.FileInfo, err error) error {
	// 	fmt.Println(path)
	// 	return nil
	// })

	// http.ServeFile(w, r, "C:\\Users\\spyro\\Apps\\streamy")
	http.FileServer(http.Dir("C:\\Users\\spyro\\Apps\\streamy"))
}

func saveWebmToLocalFile(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("could not read request body")
	}
	fmt.Println(body)
}
