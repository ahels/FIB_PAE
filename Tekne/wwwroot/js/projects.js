let table = new DataTable('#main-table');



function showCreate()
{
    $("#content").hide();
    $("#create").show();
}

function closeCreate()
{
    $("#create").hide();
    $("#content").show();
}

$("form").on("submit", function (e) {
    e.preventDefault()
    console.log("Submitting form")

    window.location.href = "/Simulator"
})