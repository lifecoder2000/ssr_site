$('#content').keyup( function (e){
    let content = $(this).val();
    $('#countNumber').html(content.length+" / 1000");    //글자수 실시간 카운팅

    if (content.length > 1000){
        alert("최대 1000자까지 입력 가능합니다.");
        $(this).val(content.substring(0, 1000));
        $('#countNumber').html("1000 / 1000");
    }
});