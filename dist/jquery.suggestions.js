/*! Suggestions - v0.0.1 - 2014-11-07
* https://github.com/CERNDocumentServer/suggestions
* Copyright (c) 2014 CERN; Licensed Revised, BSD */
;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "suggestion",
    defaults = {
        callbacks: {
            success: function(){},
            error: function(){},
        },
        templates: {
            wrapper: "<div class='"+pluginName+"-wrapper'>{{{messages}}} "+
                "{{{loading}}} {{{content}}}</div>",
            messages: "<div class='"+pluginName+"-messages'></div>",
            loading: "<div class='"+pluginName+"-loading'></div>",
            input: "<label for='{{name}}'>{{label}}</label>" +
                "<input type='text' name='{{name}}' value='{{value}}'" +
                " placeholder='{{placeholder}}' />",
            textarea: "<label for='{{name}}'>{{label}}</label>" +
                "<textarea name='{{name}}'></textarea>",
            select: "<label for='{{name}}'>{{label}}</label>" +
                "<select name='{{name}}'>" +
                "{{#each values}}" +
                "<option name='{{value}}'>{{option}}</option>" +
                "{{/each}}" +
                "</select>",
            form:  "<form class='"+pluginName+"-form'>{{{content}}} "+
                "<button class='"+pluginName+"-form-submit' type='submit'>" +
                "{{label}}</button></form>",
        },
        classes: {
            form: '.'+pluginName+'-form',
            button: '.'+pluginName+'cds-crowd-form-submit',
            messages: '.'+pluginName+'cds-crowd-messages',
            loading: '.'+pluginName+'cds-crowd-loading',
        }
    };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.$el = $(element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        $messages: null,
        $loading: null,
        $form: null,
        $button: null,
        in_process: false,
        init: function () {
            this._render();
        },
        destroy: function(){
            // Destroy the instance
            this.$el.removeData();
        },
        // >>>>> MESSAGING
        loading: function(){
            this.$loading.html('Loading');
        },
        unloading: function(){
            this.$loading.empty();
        },
        message: function(message){
            this.$messages.html(message);
        },
        unmessage: function(){
            this.$messages.empty();
        },
        always: function(){
            this.unloading();
        },
        // #### MESSAGING
        // >>>> Handlers
        success: function(response){
            this.message('success');
            // Call the callback
            this.options.callbacks.success.call(this, this.$el, response, this._render);
        },
        error: function(status, error){
            var message = status + ' ' + error;
            this.message(message);
            // Call the callback
            this.options.callbacks.error.call(this, this.$el, status, error, this._render);
        },
        // #### Handlers
        // >>>> Private functions
        _save: function (data) {
            var deferred = $.Deferred();
            $.ajax({
                url: this.options.url,
                data: data
            })
            .done(function(response){
                deferred.resolve(response);
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                deferred.reject(jqXHR, textStatus, errorThrown);
            });
            return deferred.promise();
        },
        _process: function(){
            var that = this;
            that.in_progress = true;
            //that.unmessage();
            var data = [];
            that.loading();
            $.when(
                that._save(data)
            ).then(
            function(response){
                that.success(response);
            }, function(jqXHR, textStatus, errorThrown){
                that.error(textStatus, errorThrown);
            }
            ).always(function(){
                that.unloading();
                that.in_process = false;
            });

        },
        _render: function(){
            var that = this;
            var _content = "";
            var _template;

            var wrapper = Handlebars.compile(that.options.templates.wrapper);
            var messages = Handlebars.compile(that.options.templates.messages);
            var loader = Handlebars.compile(that.options.templates.loading);
            var form = Handlebars.compile(that.options.templates.form);
            $.when(
                $.each(that.options.data.content, function(index, item){
                _template = Handlebars.compile(that.options.templates[item.type]);
                _content +=_template(item);
            })
            ).done(function(){
                var _form = form({
                    content: _content,
                    label: 'Save'
                });
                var _wrapper = wrapper({
                    content: _form,
                    messages: messages(),
                    loading: loader()
                });
                that.$el.html($(_wrapper).html());
                // Bind the events
                that._binds();
            });
        },
        _binds: function(){
            var that = this;
            // Init classes
            that.$messages = that.$el.find(that.options.classes.messages);
            that.$loading = that.$el.find(that.options.classes.loading);
            that.$form = that.$el.find(that.options.classes.form);
            that.$button = that.$el.find(that.options.classes.button);
            that.$button.on('click', function(event){
                event.preventDefault();
                if(!that.in_process){
                    that._process();
                }
            });
        }
        // #### Private functions
    };
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };
})( jQuery, window, document );
