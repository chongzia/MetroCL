var Listview = {
    init: function( options, elem ) {
        this.options = $.extend( {}, this.options, options );
        this.elem  = elem;
        this.element = $(elem);
        this.views = ['list', 'content', 'icons', 'icons-medium', 'icons-large', 'tiles'];

        this._setOptionsFromDOM();
        this._create();

        return this;
    },

    options: {
        effect: "slide",
        duration: 100,
        view: METRO_LISTVIEW_MODE.LIST,
        selectNode: false,
        onNodeInsert: Metro.noop,
        onNodeDelete: Metro.noop,
        onNodeClean: Metro.noop,
        onCollapseNode: Metro.noop,
        onExpandNode: Metro.noop,
        onGroupNodeClick: Metro.noop,
        onNodeClick: Metro.noop,
        onListviewCreate: Metro.noop
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

        this._createView();
        this._createEvents();

        Utils.exec(o.onListviewCreate, [element]);
    },

    _createIcon: function(data){
        var icon, src;

        src = Utils.isTag(data) ? $(data) : $("<img>").attr("src", data);
        icon = $("<span>").addClass("icon");
        icon.html(src);

        return icon;
    },

    _createCaption: function(data){
        return $("<span>").addClass("caption").html(data);
    },

    _createToggle: function(){
        return $("<span>").addClass("node-toggle");
    },

    _createNode: function(data){
        var node;

        node = $("<li>");

        if (data.caption !== undefined) {
            node.prepend(this._createCaption(data.caption));
        }

        if (data.icon !== undefined) {
            node.prepend(this._createIcon(data.icon));
        }

        if (data.html !== undefined) {
            node.append(data.html);
        }

        return node;
    },

    _createView: function(){
        var that = this, element = this.element, o = this.options;
        var nodes = element.find("li");

        element.addClass("listview");
        element.find("ul").addClass("listview");

        $.each(nodes, function(){
            var node = $(this);

            if (node.data("caption") !== undefined) {
                node.prepend(that._createCaption(node.data("caption")));
            }

            if (node.data('icon') !== undefined) {
                node.prepend(that._createIcon(node.data('icon')));
            }

            if (node.children("ul").length > 0) {
                node.addClass("node-group");
                node.append(that._createToggle());
                if (node.data("collapsed") !== true) node.addClass("expanded");
            } else {
                node.addClass("node");
            }
        });

        this.view(o.view);
    },

    _createEvents: function(){
        var that = this, element = this.element, o = this.options;

        element.on("click", ".node", function(){
            var node = $(this);
            if (o.selectNode === true) {
                element.find(".node").removeClass("current");
                node.toggleClass("current");
            }
            Utils.exec(o.onNodeClick, [node, element])
        });

        element.on("click", ".node-toggle", function(){
            var node = $(this).closest("li");
            that.toggleNode(node);
        });

        element.on("click", ".node-group > .caption", function(){
            var node = $(this).closest("li");
            element.find(".node-group").removeClass("current-group");
            node.addClass("current-group");
            Utils.exec(o.onGroupNodeClick, [node, element])
        });

        element.on("dblclick", ".node-group > .caption", function(){
            var node = $(this).closest("li");
            that.toggleNode(node);
        });
    },

    view: function(v){
        var element = this.element, o = this.options;
        var views = this.views;

        if (v === undefined) {
            return o.view;
        }

        if (views.indexOf(v) === -1) {
            return ;
        }

        o.view = v;

        $.each(this.views, function(){
            element.removeClass("view-"+this);
            element.find("ul").removeClass("view-"+this);
        });

        element.addClass("view-" + o.view);
        element.find("ul").addClass("view-" + o.view);
    },

    toggleNode: function(node){
        var element = this.element, o = this.options;
        var func;

        if (!node.hasClass("node-group")) {
            return ;
        }

        node.toggleClass("expanded");

        if (o.effect === "slide") {
            func = node.hasClass("expanded") !== true ? "slideUp" : "slideDown";
            Utils.exec(o.onCollapseNode, [node, element]);
        } else {
            func = node.hasClass("expanded") !== true ? "fadeOut" : "fadeIn";
            Utils.exec(o.onExpandNode, [node, element]);
        }

        node.children("ul")[func](o.duration);
    },

    add: function(node, data){
        var that = this, element = this.element, o = this.options;
        var target;
        var new_node;
        var toggle;

        if (node === null) {
            target = element;
        } else {

            if (!node.hasClass("node-group")) {
                return ;
            }

            target = node.children("ul");
            if (target.length === 0) {
                target = $("<ul>").addClass("listview").addClass("view-"+o.view).appendTo(node);
                toggle = this._createToggle();
                toggle.appendTo(node);
                node.addClass("expanded");
            }
        }

        new_node = this._createNode(data);

        new_node.addClass("node").appendTo(target);

        Utils.exec(o.onNodeInsert, [new_node, element]);

        return new_node;
    },

    addGroup: function(data){
        var that = this, element = this.element, o = this.options;
        var node;

        delete data['icon'];

        node = this._createNode(data);
        node.addClass("node-group").appendTo(element);
        node.append(this._createToggle());
        node.addClass("expanded");
        node.append($("<ul>").addClass("listview").addClass("view-"+o.view));

        Utils.exec(o.onNodeInsert, [node, element]);

        return node;
    },

    insertBefore: function(node, data){
        var element = this.element, o = this.options;
        var new_node = this._createNode(data);
        new_node.insertBefore(node);
        Utils.exec(o.onNodeInsert, [new_node, element]);
        return new_node;
    },

    insertAfter: function(node, data){
        var element = this.element, o = this.options;
        var new_node = this._createNode(data);
        new_node.insertAfter(node);
        Utils.exec(o.onNodeInsert, [new_node, element]);
        return new_node;
    },

    del: function(node){
        var element = this.element, o = this.options;
        var parent_list = node.closest("ul");
        var parent_node = parent_list.closest("li");
        node.remove();
        if (parent_list.children().length === 0 && !parent_list.is(element)) {
            parent_list.remove();
            parent_node.removeClass("expanded");
            parent_node.children(".node-toggle").remove();
        }
        Utils.exec(o.onNodeDelete, [node, element]);
    },

    clean: function(node){
        var element = this.element, o = this.options;
        node.children("ul").remove();
        node.removeClass("expanded");
        node.children(".node-toggle").remove();
        Utils.exec(o.onNodeClean, [node, element]);
    },

    changeView: function(){
        var element = this.element, o = this.options;
        var new_view = "view-"+element.attr("data-view");
        if (this.views.indexOf(new_view) === -1) {
            return ;
        }
        o.view = new_view;
        this.view();
    },

    changeAttribute: function(attributeName){
        switch (attributeName) {
            case "data-view": this.changeView(); break;
        }
    }
};

Metro.plugin('listview', Listview);