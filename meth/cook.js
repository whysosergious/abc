

// const form = document.getElementById("form1");
// const filePicker = document.querySelector("[type=file]");
_elC.images = [];
   _elC.albums = [];

// main db queries class
window._dbCook = {

   // api scripts
   getterScript: "meth/get_data.php",
   setterScript: "meth/set_data.php",

   // main function and async request
   cook: function(url, formData) {

      fetch(url, {
         method: "POST",
         body: formData
      })
      .then(res => 
         res.json()).then(data => {
            url == "meth/get_data.php" && _sortData(data);
            // console.log(data);

            if (data[0]=="dbRes") {
               _elC.excCount = data[data.length-1][1];
               for (let i=1; i<data.length; i++) {
                  _elC[data[i][0]].dbId = data[i][1];
                  console.log(data[i]);
               }
            } 
            if (data[0]=="dbGalRes") {
               _elC.mediaCount = data[data.length-1][1];
               for (let i=1; i<data.length; i++) {
                  _elC.images[data[i][0]].dbId = data[i][1];
                  console.log(_elC.images[data[i][0]].dbId);
                  console.log(data[i]);
               }
            }
         })
      // .then(text => console.log(text))
      .catch(msg => console.log(msg));
   },

   // get all from target table
   getAll: function(tgt) {
      var formData = new FormData();
      formData.append("db_table", tgt);
      
      this.cook(this.getterScript, formData);
   },

   // upload file to target table/directory
   new: function(formData, tgt) {
      formData.append("db_table", tgt);
      
      this.cook(this.setterScript, formData);
   },

   // data forms for different tables
   formMenu: function(obj) {

      var formData = new FormData();

      formData.append("id", obj.id);
      formData.append("file_name", obj.name);
      formData.append("file_size", obj.size);
      formData.append("files[]", obj.path);
      formData.append("author", obj.author);

      var pages = Object.values(obj.pages);

      // formData.append("pages[]", obj.pages)
      for (let i=0;i<pages.length; i++) {
         
         formData.append("pages_name[]", pages[i].name);
         formData.append("pages_size[]", pages[i].size);
         formData.append("pages_url[]", pages[i].url);

      }

      this.new(formData, "menues");
   },
   formReghours: function(obj) {

      var formData = new FormData();

      var values = Object.values(obj);

      for (let i=0;i<8; i++) {

         formData.append("day[]", Object.keys(obj)[i]);
         formData.append("closed[]", values[i].closed);
         formData.append("hours[]", values[i].hours);
         formData.append("author[]", values[i].author);

      }

      this.new(formData, "reghours");
   },
   formExchours: function(obj) {

      var formData = new FormData();

      let keys = Object.keys(obj);
      let values = Object.values(obj);
      
      formData.append("db_host_id", obj.dbId);
      formData.append("host_id", values[1]);
      formData.append("group_title", values[2]);
      formData.append("author", values[3]);
      formData.append("delete_queue[]", values[4]);


      for (let i=5; i<keys.length; i++) {
         formData.append("db_id[]", values[i][0]);
         formData.append("exc_id[]", keys[i]);
         formData.append("exc_date[]", values[i][1]);
         formData.append("exc_hours[]", values[i][2]);
         formData.append("exc_closed[]", values[i].excClosed);
      }

      this.new(formData, "exception_hours");
   },

   formUser: function(obj) {

      var formData = new FormData();

      formData.append("db_id", obj.dbId);
      formData.append("user_id", obj.id);
      formData.append("user_name", obj.userName);
      formData.append("user_email", obj.email);
      formData.append("user_pass", obj.password);
      formData.append("user_email", obj.email);
      formData.append("user_role", obj.role);
      formData.append("user_icon", obj.icon);

      this.new(formData, "users");
   },

   formDeleteGroup: function(obj) {

      var formData = new FormData();

      formData.append("tgt_table", obj.tgtTable);
      formData.append("delete_queue[]", obj.deleteQueue);

      this.new(formData, "delete_group");
   },

   formGallery: function(arr) {

      var formData = new FormData();

      formData.append("author", arr[0].author);

      for (let i=0; i<arr.length; i++) {

         formData.append("db_id[]", arr[i].dbId);
         formData.append("album[]", arr[i].album);
         formData.append("img_id[]", arr[i].imgId);
         formData.append("img_title[]", arr[i].imgTitle);
         formData.append("files[]", arr[i].imgUrl);

         formData.append("img_size[]", arr[i].imgSize);
         formData.append("img_type[]", arr[i].imgType);
         formData.append("img_ext[]", arr[i].imgExt);
         formData.append("img_asra[]", arr[i].imgAsra);
         formData.append("img_mid[]", arr[i].imgMid);
         formData.append("mid_size[]", arr[i].midSize);
         formData.append("img_tiny[]", arr[i].imgTiny);
         formData.append("tiny_size[]", arr[i].tinySize);
         
      }

      this.new(formData, "image_gallery");
   }
}


window.rf = Array;
// dbCook.getAll("menues");

// on form submit
// form.addEventListener('submit', (e) => {
function initCook() {

   var formData = new FormData();
   var files = filePicker.files;

   for (let i = 0; i < files.length; i++) {
      var file = files[i];

      formData.append('files[]', file);
   }

   dbCook.new(formData, "menues");
}
// });



