$("form").on("submit", function (e) {
    e.preventDefault()
    console.log("Submitting form")

    window.location.href = "/Projects"
})