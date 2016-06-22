$(function() {
    var pageTransitions = [['full',1600],['mobile',800],['tiny',400],['micro',0]]; // number shows minimum size - must be from high to low
    function resize() {
        var target = 0,
            w = $(window).width(),
            h = $('html');
        $.each(pageTransitions, function(index, pageTransition) {
            if( w > pageTransition[1]) {
                target = index;
                return false;
            }
        });
        $.each(pageTransitions, function(index, pageTransition) {
            h.removeClass(pageTransition[0]);
        });
        h.addClass(pageTransitions[target][0]);
    }
    resize();
    jQuery(window).on('resize', function() {
        resize();
    });
});
