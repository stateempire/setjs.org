# SPA Architecture
The SPA uses jQuery and custom templating.
##Templating
The templating support is provided by static/src/scripts/helpers/templates.js file. Templates can either be loaded at startup or during runtime.

###1. Concepts
####1.1. Load-time Templates
These are loaded with initial HTML inside &lt;script type="text/x-template"&gt; elements. There are many such templates in *static/src/views/layout/includes/x-templates* folder. The file *static/src/views/layout/includes/x-templates.pug* combines these in a single &lt;script type="text/x-template"&gt; element. The startup code in *static/src/scripts/main.js* then loads these templates.

You can add more folders or files as needed. There is no restriction on the number or location of these files. All that's needed is that you obtain the template string and call the *loadTemplates(templateStr)* function before using those templates.

####1.2. On-demand Templates
These templates are not included in initial HTML. Instead these are loaded on demand when first needed. The result is then cached by templates.js and used for subsequent use. By default, all on-demand templates are loaded HTML files in the /templates/ folder at the server root. There are a number of such **pug** based templates in the *static/src/views/page/templates* folder, which are then placed in /templates/ folder at build time.

There is no restriction on the number of templates defined in a single file. If there is a need to group certain templates (for example when you expect them to be used together), feel free to put them in a single file and load that file before using any of those templates.

*ensureTemplates()* function is used to load templates from the /templates/ folder.

##2. API
The following functions are exported by templates.js:
####2.1. loadTemplates(templateStr)
A template must be loaded by template.js file before it can be used. If a template string is available (e.g. during initial page load), it can be loaded by calling this function.
####2.2. ensureTemplates({urls = [], success, error})
This function helps with on-demand loading of templates. Each file at the provided *URL* can contain one or more templates. Once loaded, the templates will be cached for subsequent use.
####2.3. getHtml (templateName)
Returns the HTML string of the template. If the template is not present, an exception will be thrown.
####2.4. getTemplate (templateName)
Obtain the template named *templateName* as a plain string. If the template is not found, an exception will be thrown. More often, you'll be using the *getComponent()* function, which is explained next.
####2.5. getComponent(templateName, data, actions)
This is the main function behind our custom component based templating. The other two parameters after *templateName*, namely *data* and *callbacks*, enable this function to convert the template string into a component with support for variables and event handlers. You provide the variables as fields of *data* and event handlers as fields of the *callbacks* objects.
####2.6. addComponent(name, func)
JS based behavior can be made available to be used directly from HTML using this method. After a component is added using this method, you can use it in HTML using *data-config='{"comp": "component_name"}'*.
####2.7. addGlobalAction(name, onFunc, beforeFunc)
This method can be used to define actions that are available to all components in addition to the already defined actions passed via the *actions* parameter of the *getComponent()* function.

##3. Component Example
```
<script id="example-templates" type="text/x-template">
   <div class="example" data-template="example-comp">
      <div class="some-text">{txt}</div>
      <button data-name="button1" data-act="click" data-func="btnClick">{btn1Text}</button>
  </div>
</script>
<script>
  loadTemplates($('#example-templates').html());
  var data = {txt: "Some text to show", btn1Text: "Click me!"};
  var actions = {
    btnClick: function (params) {
      var {$el, name, comp, e, arg, group, data, payload} = params;
      console.log(params);
    }
  }
  var comp = getComponent('example-comp', data, actions);
  console.log(comp.$button1.text());
</script>
```
