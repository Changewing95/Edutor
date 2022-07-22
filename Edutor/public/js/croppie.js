// Advanced Features - JEREMY


$(function () {
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle' //circle
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    $('#insert_image').on('change', function () {
        var checkformat = ['png', 'jpg', 'jpeg', 'tiff', 'tga', 'gif']
        if (checkformat.includes(this.files[0].name.split('.').pop())) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $image_crop.croppie('bind', {
                    url: event.target.result
                }).then(function () {
                    console.log('jQuery bind complete');
                });
            }
            reader.readAsDataURL(this.files[0]);
            $('#insertimageModal').modal('show');
        } else {
            $("#InvalidImage").show()
        }


    });

    $('.crop_image').on('click', function () {
        $image_crop.croppie('result', {
            type: 'canvas',
            size: 'viewport',
            type: 'blob',
            format: 'png'
        }).then((response) => {
            console.log(response);
            $.ajax({
                url: '/dashboard/profilePictureUpload',
                type: 'PUT',
                data: response,
                processData: false,
                contentType: false,
                complete: function (data) {
                    console.log("asd");
                    $('#insertimageModal').modal('hide');
                    window.location.reload();
                }
            })
        });
    });


});

