/*! Dynamic forms - v0.0.6 - 2014-11-12
* https://github.com/CERNDocumentServer/dynamic-forms
* Copyright (c) 2014 CERN; Licensed Revised, BSD */
;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = "dynamicForms",
    defaults = {
      messages:{
        description: '',
        error: 'Error',
        success: 'Success',
        loading: 'Loading ...'
      },
      callbacks: {
        success: function(){},
        error: function(){},
        rendered: function(){},
        loaded: function(){},
      },
      templates: {
        wrapper: "<div class='"+pluginName+"-wrapper'>{{{messages}}} "+
                    "{{{loading}}} {{{description}}}{{{content}}}</div>",
        messages: "<div class='"+pluginName+"-messages'></div>",
        text: "<div class='"+pluginName+"-text'>{{{value}}}</div>",
        loading: "<div class='"+pluginName+"-loading'></div>",
        input: "<label for='{{name}}'>{{label}}</label>" +
              "<input type='text' name='{{name}}' value='{{value}}'" +
              " placeholder='{{placeholder}}' />",
        hidden: "<input type='hidden' name='{{name}}' value='{{value}}' />",
        textarea: "<label for='{{name}}'>{{label}}</label>" +
              "<textarea name='{{name}}'></textarea>",
        select: "<label for='{{name}}'>{{label}}</label>" +
              "<select name='{{name}}'>" +
              "{{#each values}}" +
              "<option value='{{value}}'>{{option}}</option>" +
              "{{/each}}" +
              "</select>",
        form:  "<form class='"+pluginName+"-form'>{{{content}}} "+
              "<button class='"+pluginName+"-form-submit' type='submit'>" +
              "{{label}}</button></form>",
        description: "<div class='"+pluginName+"-description'>{{{description}}}</div>",
        error: "<p class='"+pluginName+"-message-error'>{{{message}}}</p>",
        success: "<p class='"+pluginName+"-message-success'>{{{message}}}</p>"
      },
      classes: {
        description: '.'+pluginName+'-description',
        form: '.'+pluginName+'-form',
        button: '.'+pluginName+'-form-submit',
        messages: '.'+pluginName+'-messages',
        loading: '.'+pluginName+'-loading',
      }
    };

    // The actual plugin constructor
    function Plugin ( element, options ) {
      this.element = element;
      this.$el = $(element);
      this.options = $.extend(true, {}, defaults, options );
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
        this.$loading.html(this.options.messages.loading);
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
      success: function(data, response){
        var _message = Handlebars.compile(this.options.templates.success);
        this.message(_message({
          message: this.options.messages.success
        }));
        // Call the callback
        this.options.callbacks.success.call(this, this.$el, data, response, this._render);
      },
      error: function(error){
        var _message = Handlebars.compile(this.options.templates.error);
        this.message(_message({
          message: (error.message !== undefined) ? error.message : this.options.messages.error
        }));
        // Call the callback
        this.options.callbacks.error.call(this, this.$el, error, this._render);
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
        .fail(function(response){
            deferred.reject(response);
        });
        return deferred.promise();
      },
      _process: function(){
        var that = this;
        that.in_progress = true;
        that.unmessage();
        var data = that.$form.serialize();
        that.loading();
        $.when(
          that._save(data)
        ).then(
        function(response){
          if(response.error){
            that.error(response);
          }else{
            that.success(data, response);
          }
        }, function(response){
          that.error(response);
        }
        ).always(function(){
          that.unloading();
          that.in_process = false;
          // Notify that loading finished
          that.options.callbacks.loaded.call(that, that.$el);
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
        var description = Handlebars.compile(that.options.templates.description);

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
          var _description = description({
            description: that.options.messages.description
          });
          var _wrapper = wrapper({
            description: _description,
            content: _form,
            messages: messages(),
            loading: loader()
          });
          that.$el.html($(_wrapper).html());
          // Notify that rendered finished
          that.options.callbacks.rendered.call(this, this.$el);
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
