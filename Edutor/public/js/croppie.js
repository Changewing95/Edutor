$(function() {
    alert("hi11");
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'square' //circle
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    $('#insert_image').on('change', function () {
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
    });

    $('.crop_image').on('click', function (req) {
        alert("hi");
        $image_crop.croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then((response) => {
            console.log(response);
            req.file = response;
            $.ajax({
                url: '/dashboard/profilePictureUpload',
                type: 'POST',
                data: response,
                success: function (data) {
                    console.log(req.file);
                    $('#insertimageModal').modal('hide');
                    console.log(data)
                    // load_images();
                    // alert(data);
                }
            })
        });
    });
    

    load_images();

    function load_images() {
        $.ajax({
            url: "fetch_images.php",
            success: function (data) {
                $('#store_image').html(data);
            }
        })
    }

});

