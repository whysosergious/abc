// namespace "abPrime"[aptbit key namespace]

window.onload = function() {


   if (!window.abPrime) {
      window.abPrime = Object.create(null);
   }


   // essential elements
   const activeUser = "demoUser";
   var raf;
   const cssRoot = document.styleSheets[0].cssRules[0].style;
   const fileLoader = document.getElementById("file-loader");
   const mediaLoader = document.getElementById("media-loader");
   const mediaGrid = document.getElementsByClassName("media-grid")[0];

   // cloneski elements
   const exceptionGroup = document.getElementById("exceptionCloneski");
   // root.appendChild(exceptionGroup);
   const exceptionLine = document.getElementById("ln");
   const newser = document.getElementById("newser");
   const previewItem = document.getElementsByClassName("preview-cloneski")[0];



   // create object to house elements and keep track of event listeners
   window._elC = Object.create(null); // main element Class

   window.optionButtons = Object.create(null);
   optionButtons.live = [];

   // just some much needed numbers
   _elC.currentTime = Date.now();
   _elC.currentYear = new Date().getFullYear();
   _elC.i = 1;
   _elC.excCount = 1;
   _elC.userCount = 1;
   _elC.mediaCount = 1;


   // add listeners to static buttons
   [...document.querySelectorAll(".create, .upload, #saveMedia")].forEach((btn) => {
      let hostId = btn.dataset.host;
      _elC[hostId] = document.getElementById(hostId);

      btn.addEventListener("mousedown", distinguishAction, {passive: true});
   });


   // the dots instance button listeners
   const dotsGroup = document.getElementsByClassName("dots");
   for (let dots of dotsGroup) {
      instanceGroup(dots);
   }


    /**
    * master function for 'group' elements that house all of our content'
    * this function finds, sorts, names(if needed) and stores content parents
    * @param {*} dots is the initiator that requiers a defined 'host' dataset with the parent id
    */
   function instanceGroup(dots) {

      let id = dots.dataset.host;

      _elC[id] = document.getElementById(id);
      _elC[id].groupTitle = _elC[id].getElementsByClassName("title editable")[0];
      _elC[id].kernel = _elC[id].getElementsByClassName("element-kernel")[0]; // content container

      _elC[id].buttons = [..._elC[id].querySelectorAll(".save, .close, .create, .edit-pass, .cancel-pass")];
      _elC[id].content = [];


      // TBD ***
      optionButtons[id] = dots.parentNode.getElementsByTagName("a");
      [...optionButtons[id]].forEach(b => b.dataset.host = id);
      // TBD ***

      _elC[id].groupTitle != null && (_elC[id].groupTitle.dataset.host = id);
      _elC[id].timestamp = _elC[id].getElementsByClassName("timestamp")[0];
      _elC[id].classList.contains("menu") && (_elC[id].pages = [],
         _elC[id].previewContainer = _elC[id].getElementsByClassName("preview-container")[0],
         _elC[id].heading = _elC[id].getElementsByClassName("heading")[0],
         _elC[id].fileinfo = _elC[id].getElementsByClassName("fileinfo")[0],
         _elC[id].pdfFile = _elC[id].getElementsByClassName("pdffile")[0]);

      _elC[id].buttons.forEach(b => b.dataset.host = id);
      _elC[id].open = false;
      _elC[id].lineCount = 1;
      [..._elC[id].getElementsByClassName("element-content")].forEach((c) => {
         c.name = c.getAttribute("name");

         c.id = id + c.name + (c.id.match("ln") ? _elC[id].lineCount : "");
         _elC[id].lineCount++;
         instanceLine(c, id);
      });

      dots.addEventListener("mousedown", dotsOptions, {passive: true});
   }



   /**
    * Same as instanceGroup() only for group children
    * @param {HTMLElement} el
    * @param {string} hostId
    */
   function instanceLine(el, hostId) {

      _elC[el.id] = el;

      _elC[el.id].inputs = [..._elC[el.id].getElementsByTagName("input")];
      _elC[el.id].buttons = [..._elC[el.id].getElementsByClassName("icon-button")];

      _elC[el.id].buttons.forEach(b => b.dataset.host = el.id);

      _elC[el.id].dataset.host = hostId;
      _elC[hostId].content.push(el.id);

   }



   /**
    * Add/remove listeners while interacting with different elements
    */
   function dotsOptions(ev) {

      let id = this.dataset.host;

      _elC.openDots != null && _elC.openDots.classList.remove("btn-set-options");

      _elC[id].classList.add("btn-set-options");
      _elC.openDots = _elC[id];

      // TBD ***
      removeListeners(optionButtons.live);
      optionButtons.live = [];
      for (let btn of optionButtons[id]) {
         btn.addEventListener("mousedown", distinguishAction, {passive: true});

         optionButtons.live.push(btn);
      }
   }



   /**
    * Distinguishes action from input
    * determined by the "action" dataset bound to trigger element
    */
   function distinguishAction(ev) {
      // try {
         let el = _elC[this.dataset.host];
         let action = this.dataset.action;
         // console.log(el)
         window[action](el);

         // TBD ***
         removeListeners(optionButtons.live);
      // } catch(exc) { console.log("element missing dataset. [exc]> " + exc) }
   }



   /**
    * Removes event listeners for hidden elements
    * @param {Array} col
    */
   function removeListeners(col) {
      col.forEach(el =>
         el.removeEventListener("mousedown", distinguishAction, {passive: true})
      );
   }



   // input text limiter.. self explanatory I think
   var maxLength = 20;

   function limitTextInput(ev) {
      let charCount = event.target.innerText.trim().length;
      hasSelection = false;

      selection = window.getSelection();
      hasSelection = selection && !!selection.toString();

      if (charCount >= maxLength && !hasSelection) event.preventDefault();
   }


   /**
    * Generates a temporary line id for elements with undefine number of children
    * @param {HTMLElement} el
    */
   function genLineId(el) {
      return el.id + "ln" + el.lineCount++;
   }


   /**
    * Append new line to business hours exceptions
    * @param {HTMLElement} el
    */
   function appendLine(el) {

      let appendedEl;

      let hero = [el, el.kernel];


      let siblings = el.parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling = siblings[heroIndex + 1];
      let nextSiblingPos = nextSibling.offsetTop;



      hero.forEach(h => h.classList.add("stall-transition", "shift"));
      el.cloneski.classList.add("newbie-line");


      appendedEl = hero[1].appendChild(el.cloneski);
      delete el.cloneski;


      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      staggerDelay(el, heroIndex, true);


      return new Promise(function(res, rej) {
         window.cancelAnimationFrame(raf);
         raf = window.requestAnimationFrame(()=> {

            hero.forEach(h => h.classList.remove("stall-transition", "shift"));

            appendedEl.classList.remove("newbie-line");

            instanceLine(appendedEl, hero[0].id);
            _elC[appendedEl.id].inputs.forEach((inp) => {
               inp.removeAttribute("disabled");
               inp.addEventListener("focus", inputInFocus, {passive: true});
            });

            _elC[appendedEl.id].buttons.forEach(btn => btn.addEventListener("mousedown", distinguishAction, {passive: true, once: true}));
            res(appendedEl);
         });
      });

   }


   /**
    * Append new element group
    * @param {HTMLElement} el
    */
   function appendGroup(el) {

      let appendedEl;

      let siblings = el.parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling = siblings[heroIndex + 1];
      let nextSiblingPos = nextSibling.offsetTop;

      el.classList.add("stall-transition", "shift");

      // append, move, resize or delete target element
      appendedEl = el.parentNode.insertBefore(el.cloneski, nextSibling);
      delete el.cloneski;



      // set shift distance [oldnextSiblingPos - newnextSiblingPos]
      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      staggerDelay(el, heroIndex, true);


      return new Promise(function(res, rej) {
         // remove stall class and initiate transitions
         window.cancelAnimationFrame(raf);
         raf = window.requestAnimationFrame(function() {

            el.classList.remove("stall-transition", "shift");
            appendedEl.classList.remove("newbie");

            setTimeout(instanceGroup(appendedEl.dots),70);

            appendedEl.classList.contains("exc-hours") && setTimeout(openEdit,400,appendedEl);

            res(appendedEl);
         });
      });
   }


   /**
    * Cancel element edit (Changes remain in session)
    * @param {HTMLElement} el
    */
   function closeEdit(el) {
      el.open = false;
      let siblings = el.parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling = siblings[heroIndex + 1];
      let nextSiblingPos = nextSibling.offsetTop;



      el.classList.add("stall-transition", "shift", "toggle-options");
      el.classList.remove("cloneski"); // TBD


      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      staggerDelay(el, heroIndex);


      return new Promise(function(res, rej) {
         window.cancelAnimationFrame(raf);
         raf = window.requestAnimationFrame(()=> {

            el.classList.remove("stall-transition", "shift", "toggle-options", "open", "btn-set-edit");



            setTimeout(idleGroupInput(el),70);
            res(_elC[el.id]);
         });
      });
   }

   /**
    * Start edit of data group
    * @param {HTMLElement} el
    */
   function openEdit(el) {
      el.open = true;

      let siblings = el.parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling = siblings[heroIndex + 1];
      let nextSiblingPos = nextSibling.offsetTop;


      el.classList.add("stall-transition", "shift", "toggle-options");

      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      staggerDelay(el, heroIndex);

      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(()=> {

         el.classList.remove("stall-transition", "shift", "toggle-options","btn-set-options");
         el.classList.add("open", "btn-set-edit");

         setTimeout(instanceGroupInput(el),70);
      });
   }


   /**
    * Enforce specified rules for passwords
    * @param {HTMLElement} el
    * @param {Boolean} cancel
    * @param {Boolean} close
    */
   function passwordEdit(el, cancel = false, close = false) {

      let siblings = el.parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling = siblings[heroIndex + 1];
      let nextSiblingPos = nextSibling.offsetTop;

      let classArray = ["stall-transition", "shift"]

      el.classList.add(...classArray);
      el.kernel.classList.add(...classArray);
      close && el.classList.add("toggle-options");

      !cancel ? el.classList.add("pass-edit") : el.classList.remove("pass-edit");
      close && el.classList.remove("cloneski");

      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      staggerDelay(el, heroIndex);


      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(()=> {

         el.classList.remove(...classArray);
         el.kernel.classList.remove(...classArray);

         if (close) {
            el.classList.remove("open", "btn-set-edit", "toggle-options");
            _elC[el.id + "pass"].inputs[1].value = "";
            _elC[el.id + "repass"].inputs[0].value = "";
            setTimeout(idleGroupInput(el),70);
         }
      });
   }


   /**
    * Enable editable fields
    * @param {HTMLElement} el
    */
   function instanceGroupInput(el) {

      if (_elC[el.id].groupTitle != null) {
         _elC[el.id].groupTitle.setAttribute("contenteditable", "true");
         _elC[el.id].groupTitle.addEventListener("keydown", limitTextInput, false);
      }

      el.buttons.forEach(btn => btn.addEventListener("mousedown", distinguishAction, {passive: true}));
      _elC[el.id].content.forEach((cnt) => {
         _elC[cnt].inputs.forEach((inp) => {
            inp.removeAttribute("disabled");
            !_elC[el.id].classList.contains("user") && inp.addEventListener("focus", inputInFocus, {passive: true});
         });
         _elC[cnt].buttons.forEach(c => c.addEventListener("mousedown", distinguishAction, {passive: true}));
      });
   }

   /**
    * Disable editable fields
    * @param {HTMLElement} el
    */
   function idleGroupInput(el) {
      if (_elC[el.id].groupTitle != null) {
         _elC[el.id].groupTitle.setAttribute("contenteditable", "false");
         _elC[el.id].groupTitle.removeEventListener("keydown", limitTextInput, false);
      }
      _elC[el.id].content.forEach(cnt => _elC[cnt].inputs.forEach((inp) => {
         inp.setAttribute("disabled", "");
         inp.removeEventListener("focus", inputInFocus, {passive: true});
      }));
   }


   /**
    * Update input-field values and placeholders on field focus
    */
   function inputInFocus(ev) {

      ev.target.addEventListener("focusout", ()=> {

         ev.target.value = ('0' + (ev.target.value || ev.target.placeholder)).slice(-2);
      }, {passive: true, once:true});
   }

   /**
    * Delete data group
    * @param {HTMLElement} el
    */
   function deleteElement(el) {

      // collect affected elements into an array
      let hero = [el];
      let siblings = hero[0].parentNode.children;
      let heroIndex = [].indexOf.call(siblings, el);
      let nextSibling;

      if (el.dataset.host != null) {
         hero = [_elC[el.dataset.host], _elC[el.dataset.host].kernel, el];
         nextSibling = _elC[el.dataset.host].nextElementSibling;
         heroIndex = 0;
      } else {
         heroIndex = [].indexOf.call(siblings, el);
         nextSibling = siblings[heroIndex + 1];
      }

      let nextSiblingPos = nextSibling.offsetTop;
      let elWidth = el.offsetWidth;

      hero.forEach(h => h.classList.add("stall-transition", "shift"));

      // append, move, resize or delete target element
      el.classList.add("pull-from-layout");

      // set shift distance [oldnextSiblingPos - newnextSiblingPos]
      cssRoot.setProperty("--slide-height", (nextSiblingPos - nextSibling.offsetTop) + "px");
      cssRoot.setProperty("--tgt-width", elWidth + "px");

      staggerDelay(hero[0], heroIndex);


      // remove stall class and initiate transitions
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(()=> {

         hero.forEach(h => h.classList.remove("stall-transition", "shift"));
         el.classList.add("fade-shrink");

      });


      // remove entry from parents content collection array
      if (_elC[el.dataset.host]) {
         let contentArray = _elC[el.dataset.host].content;
         let index = contentArray.indexOf(el.id);
         index > -1 && contentArray.splice(index, 1);
      }

      setTimeout(()=> {
         deleteEntryFromClass(el.id, el.content);
         el.remove(true);
      },700);
   }


   /**
    * Self explanatory?
    * Applies to animations and transitions by changing css variable values
    * @param {HTMLElement} el
    * @param {String} heroIndex
    * @param {Boolean} reverse
    */
   function staggerDelay(el, heroIndex, reverse = false) {

      let direction = ["stagger"];

      if (reverse == true) direction.push("reverse");
      el.classList.add(...direction);

      cssRoot.setProperty("--hero-index", heroIndex);

      el.addEventListener("transitionend", function(ev) {
         el.classList.remove(...direction);

      }, {passive: true, once: true});
   }



   /**
    * User role, dropdown function
    * @param {HTMLElement} el
    */
   function dropDownList(el) {
      let hostId = el.id;
      let checkedEntry;
      let listOpen = false;

      _elC[hostId + "info"].inputs.forEach(inp => (inp.type == "radio" && inp.checked && inp.addEventListener("click", roleSelectorTBD, {passive: true, once: true})));

      function roleSelectorTBD(ev) {
         ev.stopPropagation();
         checkedEntry = ev.target;
         if (listOpen == false) {
            openList(ev);
         } else if (listOpen == true) {
            closeList(ev);
         }
      }
      function openList(ev) {
         listOpen = true;
         ev.target.parentNode.classList.add("display-list");
         window.addEventListener("click", closeList, {passive: true, once: true});
      }

      function closeList(ev) {
         ev.stopPropagation();

         hostId = el.id;

         _elC[hostId + "info"].classList.remove("stall-transition", "shift");

         checkedEntry.parentNode.classList.remove("display-list");
         listOpen = false;
         dropDownList(el);
      }
   }



   /**
    *
    * TODO***                                               **********TODO
    * dont modify password
    */
   function newPassword(el) {
      let hostId = el.id;

      _elC[hostId + "pass"].inputs[0].onchange = (ev) => {

         let type = ev.target.checked == true ? "text" : "password";
         hostId = el.id;

         _elC[hostId + "pass"].inputs[1].setAttribute("type", type);
         _elC[hostId + "repass"].inputs[0].setAttribute("type", type);
      }

      _elC[hostId + "pass"].inputs[1].onkeyup = ev => validatePassword(hostId);
      _elC[hostId + "repass"].inputs[0].onkeyup = ev => validatePassword(hostId);
   }


   /**
    * Simple password validation
    * @param {String} hostId
    */
   function validatePassword(hostId) {
      let passValid = false;
      let str =  _elC[hostId + "pass"].inputs[1].value;
      let restr = _elC[hostId + "repass"].inputs[0].value;
      passValid == false && _elC[hostId].classList.add("savelock");

      if (!/\s/.test(str) && str.match(/^[a-zA-Z\d]+$/g) && str.length >= 6)  {
         addClass("pass", "valid");
      } else if (str.length > 0) {
         addClass("pass", "invalid");
      } else {
         removeClass("pass");
      }
      if (restr == str && restr.length >= 6) {
         addClass("repass", "valid");
         passValid = true;
         _elC[hostId].classList.remove("savelock");
      } else if (restr.length > 0) {
         addClass("repass", "invalid");
      } else {
         removeClass("repass");
      }

      function addClass(tgt, cls) {
         removeClass(tgt);
         _elC[hostId + tgt].classList.add(cls);
      }
      function removeClass(tgt) {

         _elC[hostId + tgt].classList.remove("valid", "invalid");
      }

      return passValid;
   }





   //_________________________$ Action triggers
   //
   // Various action pointer functions for user input
   //

   window.cancelEdit = (el) => {
      closeEdit(el);
      removeListeners(el.buttons);
      el.content.forEach(c => removeListeners(_elC[c].buttons));
   }

   window.viewFiles = (el) => {
      openEdit(el);
   }

   window.uploadFiles = (el) => {
      fileLoader.value = null;
      fileLoader.click();
      previewFiles(el);
   }

   window.editData = (el) => {
      openEdit(el);
      // TBD ***
      removeListeners(optionButtons.live);
   }

   window.addExceptionGroup = async (el, exc_id = null) => {

      el.cloneski = exceptionGroup.cloneNode(true);
      el.cloneski.dots = el.cloneski.getElementsByClassName("dots-cloneski")[0];
      el.cloneski.dots.classList.replace("dots-cloneski", "dots");
      exc_id != null && el.cloneski.getElementsByClassName("exception-line")[0].remove(true);
      el.cloneski.id = exc_id || `tempidexcgrp${_elC.excCount++}`;
      el.cloneski.dots.dataset.host = el.cloneski.id;



      return await appendGroup(el);
   }

   window.addException = async (el, exc_id = null) => {

      el.cloneski = exceptionLine.cloneNode(true);
      el.cloneski.id = exc_id || genLineId(el);
      el.cloneski.dataset.host = el.id;

      return await appendLine(el);

   }

   window.deleteException = (el) => {
      el.dbId && (_elC[el.dataset.host].deleteQueue ? _elC[el.dataset.host].deleteQueue.push(el.dbId) : _elC[el.dataset.host].deleteQueue = [el.dbId]);
      deleteElement(el);
   }

   window.addUser = async (el, usr_id = null) => {

      el.cloneski = newser.cloneNode(true);
      el.cloneski.dots = el.cloneski.getElementsByClassName("dots-cloneski")[0];
      el.cloneski.dots.classList.replace("dots-cloneski", "dots");

      el.cloneski.id = usr_id || `tempidnewser${_elC.userCount++}`;
      // usr_id != null && _elC[usr_id].classList.remove("edit_pass", "open");
      el.cloneski.dots.dataset.host = el.cloneski.id;
      el.cloneski.icon = el.cloneski.getElementsByClassName("iconimg")[0];

      return await asyncAwait(appendGroup(el), instanceNewserForm);
   }

   function instanceNewserForm(el) {
      instanceGroupInput(el);
      dropDownList(el);
      newPassword(el);
   }



   window.saveData = (el) => {
      el.classList.contains("menu") && collectMenuData(el);
      el.id == "reghours" && collectReghoursData(el);
      el.classList.contains("exc-hours") && saveChanges(el);
      el.classList.contains("user") && validateEmail(el);
      el.id != "reghours" && el.id != "gallery" && (el.timestamp.innerText = "Just now by " + activeUser);
      el.id == "gallery" && chunkArray(el);

   }

   function chunkArray(el) {
      var tot = _imgData.length;
      var pie = [];
      var col = [];

      tot = tot>21 && tot % 10 + 10;
      console.log(tot, _imgData.length)
      for (let i=0; i<_imgData.length; i++) {
         col.push(_imgData[i]);

         if (i>=tot) {
            pie.push(col);
            col = [];
            tot += 10;
         }
      }

      let p = 0;
      function todatabase() {
         _dbCook.formGallery(pie[p]);
         el.classList.remove("altered");
         console.log(_imgData)
         setTimeout(()=>{
            p++;
            p<pie.length && todatabase();
         },500);
      }
      todatabase();
   }

   function validateEmail(el) {
      let email = _elC[_elC[el.id].content[0]].inputs[0].value
      var pattern = /\S+@\S+\.\S+/;

      if (pattern.test(email)) {
         saveChanges(el), el.classList.remove("pass-edit");
      } else {
         alert("Please enter an email adress.")
      }
   }

   window.changePassword = (el) => {
      passwordEdit(el);
   }

   window.cancelPassword = (el) => {
      passwordEdit(el, true);
   }

   window.cancelAndClose = (el) => {
      passwordEdit(el, true, true);
   }

   window.newAlbum = (el) => {
      console.log("create new album");
   }

   window.deleteData = (el) => {
      removeListeners(el.buttons);
      el.content.forEach(c => removeListeners(_elC[c].buttons));
      el.dbId && deleteGroupEntry(el);
      deleteElement(el);
   }


   function saveChanges(el) {
      if (el.id.match("tempid")) {
         let oldId = el.id;
         let oldContent = el.content;

         el.name = el.groupTitle.innerText.replace(/ /g, "_");
         el.id =  el.name + "$" + (el.classList.contains("user") ? _elC.userCount : _elC.excCount);

         setTimeout(()=>{
            deleteEntryFromClass(oldId, oldContent);
         }, 100);

         el.dots.dataset.host = el.id;
         instanceGroup(el.dots);
      }

      asyncAwait(closeEdit(el));

      el.classList.contains("user") ? collectUserData(el) : collectExchoursData(el);
   }

   function deleteEntryFromClass(oldId, oldContent) {

      oldContent != null && oldContent.forEach(c => delete _elC[c]);
      delete _elC[oldId];
   }

   var totalSize;
   function previewFiles(el) {
      totalSize = 0;


      fileLoader.onchange = (ev)=>{
         if (fileLoader.value != null) {
            el.classList.remove("altered");
            !el.open && openEdit(el);
            el.pages = [];
            el.file = fileLoader.files[0];
            el.pdf = el.file.name;
            let file = URL.createObjectURL(fileLoader.files[0]);
            el.pdfFile.setAttribute("href", file);

            let old = [...el.previewContainer.children];
            old.forEach((el) => {
               el.style.transitionDuration = ".07s";
               el.style.opacity = 0;
            });

            setTimeout(()=>{

               renderPDF(file, el);

               old.forEach(el => el.remove(true));
               el.heading.innerText = el.pdf;
            }, 70)
         }
      }
   }


   window.uploadMedia = (el) => {
      mediaLoader.value = null;
      mediaLoader.click();

      mediaLoader.onchange = (ev) => {
         _imgData = [];

         el.files = mediaLoader.files;
         prepMedia(el);
      }
   }


   /**
    * Passthrough async function for initiation and finalization of promise
    * @param {Promise} promise
    * @param {Boolean} exec
    */
   async function asyncAwait(promise, exec = null) {
      const result = await promise;
      exec != null && exec(result);
      return result;
   }



   //_________________________$ Collectors and Processors
   //
   // Various functions that collect, sort and distribute incoming or outgoing data
   //

   window._imgData = [];

   /**
    * Append loaded media to gallery
    * @param {Array} col
    * @param {bigint} i
    * @param {bigInt} count
    */
   abPrime.appendMedia = function (col, i, count) {


      let container = document.createElement("div");
      container.id = col.imgId;
      let img = new Image();
      img.src = col.imgMid;
      container.classList.add("element-container");
      img.classList.add("gallery-media");
      container.appendChild(img);
      mediaGrid.prepend(container);
      col.author = activeUser;

      _elC.images[container.id] = container;

      _imgData.push(col);

      count == i && _elC.gallery.classList.add("altered");
   }


   /**
    * Manage menu preview images
    * @param {string} imgUrl
    * @param {HTMLElement} el
    * @param {bigInt} i
    * @param {bigInt} pageCount
    * @param {bigInt} lastPage
    */
   abPrime.appendPreview = function(imgUrl, el, i, pageCount, lastPage = false) {
      let img = new Image();

      let deprClasses = ["preview-cloneski"];

      pageCount==1 && deprClasses.push("col-two", "col-three");
      pageCount>1 && deprClasses.push("col-one");
      pageCount==2 && deprClasses.push("col-three");
      pageCount>2 && deprClasses.push("col-two");
      pageCount>3 && deprClasses.push("col-three");
      pageCount<=3 ? el.previewContainer.classList.add("hide-overflow-x") : el.previewContainer.classList.remove("hide-overflow-x");

      el.cloneski = previewItem.cloneNode(true);
      el.cloneski.classList.remove(...deprClasses);

      img.src = imgUrl;
      el.cloneski.prepend(img);



      let page = el.previewContainer.appendChild(el.cloneski);
      delete el.cloneski;

      page.url = imgUrl;
      page.name = "Page" + i;
      page.size = Math.floor(imgUrl.length * .75 / 1000);
      page.getElementsByTagName("h4")[0].innerText = page.name;
      page.getElementsByTagName("h5")[0].innerText = page.size + "kb";

      el.pages.push(page);

      let displayPageCount = i>1 ? i + " Pages" : i + " Page";
      totalSize += page.size;
      let displayTotalSize = totalSize >= 1000 ? Math.floor(totalSize / 100) / 10 + "mb" : totalSize + "kb";

      el.fileinfo.innerText = displayPageCount + " | " + displayTotalSize;

      lastPage && el.classList.add("altered");
      setTimeout(()=>{
         page.classList.remove("loading");
      },20)
   }


   window._menuData = Object.create(null);

   /**
    * Collect menu data, files and images and save to database
    * @param {HTMLElement} el
    */
   function collectMenuData(el) {
      _menuData.id = el.id;
      _userData.dbId = el.dbId ? el.dbId : false;
      _menuData.name = el.pdf;
      _menuData.size = el.file.size;
      _menuData.path = el.file;
      _menuData.author = activeUser;
      _menuData.pages = el.pages;

      _dbCook.formMenu(_menuData);

      el.classList.remove("altered");
   }

   window._reghoursData = Object.create(null);
   /**
    * Collect regular business-hour data and save to database
    * @param {HTMLElement} el
    */
   function collectReghoursData(el) {
      _reghoursData = Object.create(null);

      el.content.forEach((cnt) => {
         let id = _elC[cnt].name;
         _reghoursData[id] = id;
         _reghoursData[id] = [];
         _reghoursData[id].author = activeUser;
         if (id != "schedule") {

            _reghoursData[id].closed = _elC[cnt].inputs[0].checked;
            let start = _elC[cnt].inputs[1].value != "" ? _elC[cnt].inputs[1].value : _elC[cnt].inputs[1].placeholder;
            let end = _elC[cnt].inputs[2].value != "" ? _elC[cnt].inputs[2].value : _elC[cnt].inputs[2].placeholder;
            _reghoursData[id].hours = [start, end];
         } else {

            _reghoursData[id].closed = _elC[cnt].inputs[0].checked;
            let day = _elC[cnt].inputs[1].value != "" ? _elC[cnt].inputs[1].value : _elC[cnt].inputs[1].placeholder;
            let month = _elC[cnt].inputs[2].value != "" ? _elC[cnt].inputs[2].value : _elC[cnt].inputs[2].placeholder;
            let year = _elC[cnt].inputs[3].value != "" ? _elC[cnt].inputs[3].value : _elC[cnt].inputs[3].placeholder;
            _reghoursData[id].hours = [day, month, year];
         }

      });
      _dbCook.formReghours(_reghoursData);
      closeEdit(el);
   }





   window._exchoursData = Object.create(null);

   /**
    * Collect exception hour data and save to database
    * @param {HTMLElement} el
    */
   function collectExchoursData(el) {

      _exchoursData = Object.create(null);

      _exchoursData.dbId = el.dbId || null;
      _exchoursData.hostId = el.id;

      el.name = el.groupTitle.innerText.replace(/ /g, "_");
      _exchoursData.name = el.name;
      _exchoursData.author = activeUser;
      _exchoursData.deleteQueue = el.deleteQueue || null;

      el.content.forEach((cnt) => {

         let id = cnt;

         _exchoursData[id] = [];

         if (id.match("options") == null) {

            _exchoursData[id].push(_elC[cnt].dbId ? _elC[cnt].dbId : null);

            let day = _elC[cnt].inputs[0].value != "" ? _elC[cnt].inputs[0].value : _elC[cnt].inputs[0].placeholder;
            let month = _elC[cnt].inputs[1].value != "" ? _elC[cnt].inputs[1].value : _elC[cnt].inputs[1].placeholder;
            let year = _elC[cnt].inputs[2].value != "" ? _elC[cnt].inputs[2].value : _elC[cnt].inputs[2].placeholder;


            let start = _elC[cnt].inputs[4].value != "" ? _elC[cnt].inputs[4].value : _elC[cnt].inputs[4].placeholder;
            let end = _elC[cnt].inputs[5].value != "" ? _elC[cnt].inputs[5].value : _elC[cnt].inputs[5].placeholder;

            _exchoursData[id].push([day, month, year]);
            _exchoursData[id].push([start, end]);
            _exchoursData[id].excClosed = _elC[cnt].inputs[3].checked;

         } else {
            delete _exchoursData[id];
         }
      });
      _dbCook.formExchours(_exchoursData);
      el.deleteQueue = null;
   }



   window._userData = Object.create(null);

   /**
    * Collect and save user data to database
    * @param {HTMLElement} el
    */
   function collectUserData(el) {
      _userData = Object.create(null);

      _userData.id = el.id;
      _userData.dbId = el.dbId || null;

      var checkRadio = () => {
         for (let i=1;i<=3;i++) {
            if (_elC[el.content[0]].inputs[i].checked) {
               return _elC[el.content[0]].inputs[i].value;
            }
         }
      }

      _userData.userName = el.groupTitle.innerText.replace(/ /g, "_");
      _userData.email = _elC[el.content[0]].inputs[0].value;
      _userData.password = _elC[el.content[1]].inputs[1].value;
      _userData.role = checkRadio();
      _userData.icon = el.icon.src;


      _dbCook.formUser(_userData);
   }


   window._deleteGroupData = Object.create(null);
   /**
    * Delete group entry and its children from database
    * @param {HTMLElement} el
    */
   function deleteGroupEntry(el) {
      _deleteGroupData = Object.create(null);
      _deleteGroupData.deleteQueue = [];
      _deleteGroupData.tgtTable = el.classList.contains("user") ? "users" : el.classList.contains("exc-hours") && "exception_hours";
      _deleteGroupData.deleteQueue.push(el.dbId);
      el.content.forEach((cnt) => {
         _elC[cnt].dbId && (_deleteGroupData.deleteQueue.push(_elC[cnt].dbId));
      });
      _dbCook.formDeleteGroup(_deleteGroupData);
   }


   /**
    * Load database entries
    */
   function loadAllData() {
      _dbCook.getAll("menues");
      _dbCook.getAll("lunch_pages");
      _dbCook.getAll("drinks_pages");
      _dbCook.getAll("food_pages");
      _dbCook.getAll("reghours");
      _dbCook.getAll("exception_hours");
      _dbCook.getAll("image_gallery");
   }


   /**
    * Sorts and displays data recieved from database
    * @param {Array} data
    */
   window._sortData = function(data){
      // console.log(data);
      if (data[0] == "menu") {
         for (let i=1; i<=3; i++) {
            _elC[data[i][0]].heading.innerText = data[i][1];
            let humanTimeStamp = new Date(data[i][2].replace(/-/g, "/")).toISOString();

            _elC[data[i][0]].timestamp.innerText = timeStampFormat(humanTimeStamp) + " by " + data[i][5];
            _elC[data[i][0]].pdfFile.setAttribute("href", "meth/" + data[i][4]);
         }
      } else if (data[0].match("pages")) {
         totalSize = 0;
         let id = data[0].split("_")[0]

         for (let i=1; i<data.length; i++) {

            let lastPage = i<data.length ? false : true;
            abPrime.appendPreview(data[i][2], _elC[id], i, data.length-1, lastPage);
         }

      } else if (data[0] == "reghours") {
         data.shift();

         let ts_arr = data.map(d => Math.max(new Date(d[4].replace(/-/g, "/"))));
         let last_ts = ts_arr.indexOf(Math.max(...ts_arr));

         let humanTimeStamp = new Date(data[last_ts][4].replace(/-/g, "/"));

         for (let i=0; i<data.length; i++) {
            let tgt = 'reghours' + data[i][1];
            var values = data[i][3].split(",");

            _elC[tgt].inputs[0].checked = JSON.parse(data[i][2]);

            for (let i=0; i<values.length; i++) {
               // console.log(_elC[tgt].inputs[i+1])
               console.log(values[i])
               _elC[tgt].inputs[i+1].value = JSON.parse(values[i]);
            }
         }
      } else if (data[0] == "exception_hours") {
         data.shift();

         var i = -1;
         function loadExceptions(data) {
            i++;
            if (data[i][3] == "host") {

               addExceptionGroup(_elC['exchours'], data[i][2]).then((result) => {
                  result.lineCount = JSON.parse(data[data.length-1][0]) + 1;
                  result.groupTitle.innerText = data[i][1].replace(/_/g, " ");
                  let humanTimeStamp = new Date(data[i][7].replace(/-/g, "/")).toISOString();

                  result.timestamp.innerText = timeStampFormat(humanTimeStamp) + " by " + data[i][8];
                  result.name = data[i][1];
                  result.dbId = data[i][0];

                  i<data.length-1 && loadExceptions(data);

               });
            } else {

               addException(_elC[data[i][3]], data[i][2]).then((result) => {
                  var values = [...data[i][4].split(","), ...data[i][5].split(",")];
                  result.inputs.forEach(inp => inp.setAttribute("disabled", ""));

                  result.inputs[0].checked = JSON.parse(data[i][6]);

                  for (let i=0; i<values.length; i++) {
                     let text = i>=3 ? i+1 : i;
                     result.inputs[text].value = values[i];
                  }
                  result.dbId = data[i][0];
                  i<data.length-1 ? loadExceptions(data) : _dbCook.getAll("users");

               });

            }
         }
         data[0] != "empty" ? (_elC.excCount = JSON.parse(data[data.length-1][0]), loadExceptions(data)) : _dbCook.getAll("users");

      } else if (data[0] == "users") {
         data.shift();



         _elC.userCount = JSON.parse(data[data.length-1][0]);

         var i = -1;
         function loadUsers(data) {
            i++;

            let role = (data[i][4] == "admin" ? 1
                  : data[i][4] == "editor" ? 2
                  : 3);

            addUser(_elC['users'], data[i][1] + "$" + data[i][0]).then((result) => {

               data[i][0] == 1 && result.dots.remove(true);

               result.content.forEach(cnt => _elC[cnt].inputs.forEach(inp => inp.setAttribute("disabled", "")));

               result.groupTitle.removeAttribute("contenteditable");
               result.groupTitle.innerText = data[i][1].replace(/_/g, " ");
               result.icon.src = data[i][6];

               let humanTimeStamp = new Date(data[i][5].replace(/-/g, "/")).toISOString();

               result.timestamp.innerText = "Active " + timeStampFormat(humanTimeStamp);

               result.classList.remove("pass-edit", "open", "cloneski", "btn-set-edit");
               _elC[result.content[0]].inputs[0].value = data[i][2];
               _elC[result.content[0]].inputs.forEach(inp => data[i][4] == inp.value ? inp.setAttribute("checked", "") : inp.removeAttribute("checked"));
               dropDownList(result);
               result.dbId = data[i][0];
               i<data.length-1 && loadUsers(data);

            });

         }
         loadUsers(data);

      } else if (data[0] == "image_gallery" && data[1] != "empty") {
         data.shift();

         for (let i=0; i<data.length; i++) {
            let container = document.createElement("div");
            let img = new Image();
            img.src = data[i];
            container.classList.add("element-container");
            img.classList.add("gallery-media");
            mediaGrid.prepend(container.appendChild(img));
         }
      }
   }


   /**
    * Converts timestamps into human values
    * @param {timestamp} ts
    */
   function timeStampFormat(ts) {
      let msgString;
      let date = new Date(ts);

      let elapsedMin = Math.floor((_elC.currentTime - date) / 1000 / 60);
      let elapsedHours = Math.floor(elapsedMin / 60);
      let elapsedDays = Math.floor(elapsedHours / 24);

      const options = { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric" };
      date.getFullYear() != _elC.currentYear && (options.year = "numeric");

      msgString = elapsedDays>3 ? new Intl.DateTimeFormat('en-GB', options).format(date)
         : elapsedDays>2 ? "Two days ago"
         : elapsedDays>1 ? "Yesterday"
         : elapsedHours>=2 ? elapsedHours + " hours ago"
         : elapsedMin>=60 ? "An hour ago"
         : elapsedMin>2 ? elapsedMin + " minutes ago"
         : elapsedMin<2 ? "A minute ago"
         : "";

      return msgString;
   }



   /**---------
    * External scripts and processors
    */ // keep in mind that some cannot work without others
    // and some have scripts load inside them


   window._proC = Object.create(null);

   // collection
   _proC = {
      loaded: 0,
      cook: {
         file: "cook.js",
         url: "meth/",
         note: "db Cook",
         status: null
      },
      pdfjs: {
         file: "pdf.js",
         url: "meth/procs/pdfjs/",
         note: "PDF.js library.",
         status: null
      },
      pdfbit: {
         file: "pdfbit.js",
         url: "meth/procs/pdfjs/",
         note: "Renders pdf file to an image collection.",
         status: null,
      },
      imgbit: {
         file: "imgbit.js",
         url: "meth/procs/imgbit/",
         note: "Generates web-friendly Blobs",
         status: null
      }
   }


   /**
    * Load external
    */
   function loadScript() {
      _proC.loaded++;
      let entry = Object.values(_proC)[_proC.loaded];

      let script = document.createElement("script");
      script.src = entry.url + entry.file;

      script.onload = function() {
         entry.status = "ready";
         entry.file == "cook.js" && loadAllData();
         console.log(entry.file + " " + entry.status);
         Object.values(_proC)[_proC.loaded + 1] != null && loadScript();
      }
      document.head.appendChild(script);
   }

   // Object.values(_proC).forEach(ent => loadScript(ent));
   loadScript();

}