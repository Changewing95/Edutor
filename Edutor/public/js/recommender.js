var selected = 0;
$(function () {
    $('.plan').on('click', () => {
        selected = 0;
        $('.plans').children(".plan").each(function () {
            if($(this).find('input').is(':checked')) {
                selected++
                console.log(selected);
            }
        })
        if(selected > 1) {
            $('.next').attr('disabled', false)
        } else {
            $('.next').attr('disabled', true)
        }


    })

})