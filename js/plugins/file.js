var File = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);

        this._setOptionsFromDOM();
        this._create();

        Utils.exec(this.options.onCreate, [this.element]);

        return this;
    },
    options: {
        caption: "Choose file",
        disabled: false,
        onSelect: Metro.noop,
        onCreate: Metro.noop
    },

    _setOptionsFromDOM: function(){
        var that = this, element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = $.parseJSON(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var that = this, element = this.element, o = this.options;
        var prev = element.prev();
        var parent = element.parent();
        var container = $("<div>").addClass("file " + element[0].className);
        var caption = $("<span>").addClass("caption");
        var button;

        if (prev.length === 0) {
            parent.prepend(container);
        } else {
            container.insertAfter(prev);
        }

        element.appendTo(container);
        caption.insertBefore(element);

        element.on('change', function(){
            var val = $(this).val();
            if (val !== '') {
                val = val.replace(/.+[\\\/]/, "");
                caption.html(val);
                caption.attr('title', val);
                Utils.exec(o.onSelect, [val, element])
            }
        });

        button = $("<button>").addClass("button").attr("tabindex", -1).attr("type", "button").html(o.caption);
        button.appendTo(container);

        button.on('click', function(){
            element.trigger("click");
        });

        if (element.attr('dir') === 'rtl' ) {
            container.addClass("rtl");
        }

        element[0].className = '';

        if (o.disabled === true || element.is(":disabled")) {
            this.disable();
        } else {
            this.enable();
        }
    },

    disable: function(){
        this.element.data("disabled", true);
        this.element.parent().addClass("disabled");
    },

    enable: function(){
        this.element.data("disabled", false);
        this.element.parent().removeClass("disabled");
    },

    toggleState: function(){
        if (this.element.data("disabled") === false) {
            this.disable();
        } else {
            this.enable();
        }
    },

    toggleDir: function(){
        if (this.element.attr("dir") === 'rtl') {
            this.element.parent().addClass("rtl");
        } else {
            this.element.parent().removeClass("rtl");
        }
    },

    changeAttribute: function(attributeName){
        switch (attributeName) {
            case 'disabled': this.toggleState(); break;
            case 'dir': this.toggleDir(); break;
        }
    }
};

Metro.plugin('file', File);