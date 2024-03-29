// Display selected file name
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// Use fetch to call post route /video/upload
$('#consultationUpload').on('change', function () {
    let formdata = new FormData();
    let image = $("#consultationUpload")[0].files[0];
    formdata.append('consultationUpload', image);
    fetch('/tutor/consultation/upload', {
        method: 'POST',
        body: formdata
    })
        .then(res => res.json())
        .then((data) => {
            $('#consultation').attr('src', data.file);
            $('#consultationURL').attr('value', data.file); // sets consultationURL hidden field
            if (data.err) {
                $('#consultationErr').show();
                $('#consultationErr').text(data.err.message);
            }
            else {
                $('#consultationErr').hide();
            }
        })
});

$('#reviewUpload').on('change', function () {
    let formdata = new FormData();
    let image = $("#reviewUpload")[0].files[0];
    formdata.append('reviewUpload', image);
    fetch('/student/review/upload', {
        method: 'POST',
        body: formdata
    })
        .then(res => res.json())
        .then((data) => {
            $('#review').attr('src', data.file);
            $('#reviewURL').attr('value', data.file); // sets reviewURL hidden field
            if (data.err) {
                $('#reviewErr').show();
                $('#reviewErr').text(data.err.message);
            }
            else {
                $('#reviewErr').hide();
            }
        })
});

// $('#enter-room').on('change', function () {
//     let link = $("#roomURL");
//     alert(link);
//     fetch(`${link}`, {
//         method: 'POST',
//         body: link
//     })
//         .then(res => res.json())
//         .then((data) => {
//             console.log(data);
//         })
// });