

const getScript = (pageClass) => {
  return `
  (function() {
    function checkOverflow(el)
    {
      var curOverflow = el.style.overflow;

      if ( !curOverflow || curOverflow === "visible" )
          el.style.overflow = "auto";

      var isOverflowing = el.clientHeight < el.scrollHeight;

      el.style.overflow = curOverflow;

      return isOverflowing;
    }

    var lists = document.getElementsByClassName('List');

    for(var i = 0; i < lists.length; i++) {

      var list = lists[i];
      var listChildren = list.children;

      var page = list.closest(".${pageClass}");

      var cloned = [];

      for(var ii = 0; ii < listChildren.length; ii++) {
        var child = listChildren[ii];
        var style = getComputedStyle(child);
        cloned.push({
          node: child.cloneNode(true),

        });
      }

      list.innerHTML = '';

      var ii = 0, howManyTimes = cloned.length;
      function f(done) {
        var child = cloned[ii];
        var node = child.node;
        list.appendChild(node);

        setTimeout(function() {
          if(checkOverflow(list)) {

            var clone = node.cloneNode(true);
            node.remove();
            // list.parentNode.removeChild(node);
  
            var newPage = document.createElement('div');
            var newList = document.createElement('div');
  
            newList.appendChild(clone);
  
            newList.className = list.className;
            newPage.className = '${pageClass}';
  
            newPage.appendChild(newList);
            list = newList;
  
            page.parentNode.insertBefore(newPage, page.nextSibling);
            page = newPage;
          }

          ii++;
          if( ii < howManyTimes ){
            f(done);
          } else {
            done()
          }

        }, 0); 
      }
      f();
    }


    if(window.location.hash !== '#node') {
      var eles = document.getElementsByClassName('${pageClass}');
      for(var iii = 0; iii < eles.length; iii++) {
        var ele = eles[iii];
    
        var node = document.createElement('div');
        node.className = 'page-spacer';
    
        ele.parentNode.insertBefore(node, ele.nextSibling);
      }
    }
    
  })()
`;
}

const inject = (html, content, pageClass) => {
  const r = /<body>(.*)<\/body>/gms;

  html = html.replace(r, (m, g1) => {
    return `
      <body>
        <!-- Injected by web-to-pdf -->
        <script>
          window.content = ${JSON.stringify(content)};
        </script>

        ${g1}

        <!-- Injected by web-to-pdf -->
        <script type='text/javascript'>
          ${getScript(pageClass)}
        </script>
      </body> 
    `
  });

  return html;
}

module.exports = inject;

