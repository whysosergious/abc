function hello() { return "imgbit ready" }




window.onload = function() {


   /**
    * Resize media and save/upload to server
    * Next version iteration I'll implement UI elements
    */
   const mediaLoader = document.getElementById("media-loader");
   const mediaShroud = document.getElementById("media-shroud");
   
   // File selection listener
   mediaLoader.onchange = () => {
      var imageType, imageArguments, newDataURL,
         oldHeight, newHeight, oldWidth, newWidth;

      imageType = "image/jpeg";
      imageArguments = .72;   // temp, passed as function parameter ***
      newWidth = 600;   // gotten from template
      
      files = mediaLoader.files;
      console.log(files);

      for (let i=0; i<files.length; i++) {
         
         let reader = new FileReader();

         // Wait for selected media to load
         reader.onload = function() {
            
            var pdf64;
            let splitLabel = files[i].name.split(".", -1);

            let img = new Image();   // new Obj(original)

            img.src = this.result;

            // Wait for the image to load
            img.onload = function() {

               console.log(splitLabel[0])
               oldHeight = img.height;
               oldWidth = img.width;

               img.ratio = oldHeight / oldWidth;
               if (img.ratio > 1.1) {
                  img.asra = "tall"; 
                  newWidth = 960;
               } else if (img.ratio < .9) {
                  img.asra = "wide";
                  newWidth = 600;
               } else {
                  img.asra = "1:1";
               }
               newHeight = Math.floor(oldHeight / oldWidth * newWidth);

               // create a canvas element to draw the scaled image
               let canvas = document.createElement("canvas");   // new Node(thumb)
               canvas.height = newHeight;   // min-max(330-660)
               canvas.width = newWidth;   // min-max(330-660)

               // draw the scaled image and get the new data URL
               let context = canvas.getContext("2d");
               context.imageSmoothingEnabled = false;
               context.imageSmoothingQuality = "high";
               context.drawImage(img, 0, 0, newWidth, newHeight);
               newDataURL = canvas.toDataURL(imageType, imageArguments);

               // create a link element
               let link = document.createElement("a");
               link.setAttribute('download', splitLabel[0] + "." + splitLabel[1]);
               link.setAttribute('href', newDataURL);
               
               // append link and nest scaled image
               mediaShroud.appendChild(link).appendChild(canvas);
               // return newDataURL;   // can be used when image doesn't have to be downloaded
            }
         }

         reader.readAsDataURL(files[i]);
      }
   }

   


   









   // function processMedia(files) {
   //    console.log(files);
   //    console.log(files.value);
      // files.forEach((file)=>{
      //    let reader = new FileReader();
      //    reader.onload = function(onloadEvent) {

      //       let img = new Image();
      //       img.onload = function() {
      //             mediaShroud.width = img.width;
      //             mediaShroud.height = img.height;
      //             image.title = file.name;
      //             image.src = this.result;
      //             mediaShroud.appendChild(image);
      //             // context.drawImage(img,0,0);
      //       }
      //       // img.src = onloadEvent.target.result;
      //    }
      // });
      // image.title = file.name;
      // reader.readAsDataURL(ev.target.files[0]);
   // }
}