var NavigationView = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);
        this.pane = null;
        this.content = null;
        this.paneToggle = null;

        this._setOptionsFromDOM();
        this._create();

        return this;
    },

    options: {
        compact: "md",
        expanded: "lg",
        toggle: null,
        onNavigationViewCreate: Metro.noop
    },

    _setOptionsFromDOM: function(){
        var that = this, element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _create: function(){
        var that = this, element = this.element, o = this.options;

        this._createView();
        this._createEvents();

        Utils.exec(o.onNavigationViewCreate, [element]);
    },

    _createView: function(){
        var that = this, element = this.element, o = this.options;
        var pane, content, toggle;

        element
            .addClass("navview")
            .addClass("compact-"+o.compact)
            .addClass("expanded-"+o.expanded);

        pane = element.children(".navview-pane");
        content = element.children(".navview-content");
        toggle = $(o.toggle);

        this.pane = pane.length > 0 ? pane : null;
        this.content = content.length > 0 ? content : null;
        this.paneToggle = toggle.length > 0 ? toggle : null;
    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;
        var pane = this.pane, content = this.content;

        element.on(Metro.events.click, ".pull-button, .holder", function(){
            var pane_compact = pane.width() < 280;

            if (that.pane.hasClass("open")) {
                that.close();
                return ;
            }

            if ((pane_compact || element.hasClass("expand")) && !element.hasClass("compacted")) {
                element.toggleClass("expand");
                return ;
            }

            if (element.hasClass("compacted") || !pane_compact) {
                element.toggleClass("compacted");
                return ;
            }

        });

        if (this.paneToggle !== null) {
            this.paneToggle.on(Metro.events.click, function(){
                that.pane.toggleClass("open");
            })
        }

        $(window).on(Metro.events.resize, function(){

            element.removeClass("expand");
            that.pane.removeClass("open");

            if ($(this).width() <= Metro.media_sizes[String(o.compact).toUpperCase()]) {
                element.removeClass("compacted");
            }

        })
    },

    open: function(){
        this.pane.addClass("open");
    },

    close: function(){
        this.pane.removeClass("open");
    },

    changeAttribute: function(attributeName){

    }
};

Metro.plugin('navview', NavigationView);