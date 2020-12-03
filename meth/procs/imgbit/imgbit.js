// imgbit object
if (!window.imgBit) {
   window.imgBit = Object.create(null);
}


/**
 * Simple image handler
 */
function prepMedia(el) {

   var imgType, imgGrade, midDataURL, tinyDataURL,
      orgHeight, orgWidth, midHeight, midWidth, tinyHeight, tinyWidth;

   imgType = "image/jpeg";
   imgGrade = .72;
   
   var files = el.files;
   var fileCount = files.length;
   var img = new Image();
   
   var i = 0;
   const renderImages = function() {
      
      let collector = Object.create(null);
      
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);

      // Wait for selected media to load
      reader.onload = function() {

         img.src = this.result;
         
         let splitLabel = files[i].name.split(".", -1);

         // Wait for the image to load
         img.addEventListener("load", function(ev) {

            // console.log(splitLabel[0])
            orgHeight = img.height;
            orgWidth = img.width;
            midWidth = 800;
            tinyWidth = 400;

            img.ratio = orgHeight / orgWidth;
            if (img.ratio > 1.1) {
               img.asra = "tall"; 
               midWidth = 600;
               tinyWidth = 300;
            } else if (img.ratio < .9) {
               img.asra = "wide";
            } else {
               img.asra = "even";
            }

            midHeight = Math.floor(orgHeight / orgWidth * midWidth);
            tinyHeight = Math.floor(orgHeight / orgWidth * tinyWidth);

            // create a canvas element to draw the scaled image
            let midCanvas = document.createElement("canvas");
            let tinyCanvas = document.createElement("canvas");


            midCanvas.height = midHeight;
            midCanvas.width = midWidth;
            tinyCanvas.height = tinyHeight;
            tinyCanvas.width = tinyWidth;

            // draw the scaled image and get the new data URL
            let midCtx = midCanvas.getContext("2d");
            let tinyCtx = tinyCanvas.getContext("2d");

            midCtx.imageSmoothingEnabled = true;
            midCtx.imageSmoothingQuality = "low";
            tinyCtx.imageSmoothingEnabled = true;
            tinyCtx.imageSmoothingQuality = "low";

            midCtx.drawImage(img, 0, 0, midWidth, midHeight);
            tinyCtx.drawImage(img, 0, 0, tinyWidth, tinyHeight);
            midDataURL = midCanvas.toDataURL(imgType, imgGrade);
            tinyDataURL = tinyCanvas.toDataURL(imgType, imgGrade);

            collector = {
               dbId: null,
               album: new Date().getMonth(),
               imgId: `${splitLabel[0]}${_elC.mediaCount++}`,
               imgTitle: splitLabel[0],
               imgUrl: files[i],
               imgSize: Math.floor(files[i].size/1024),
               imgType: files[0].type,
               imgExt: splitLabel[1],
               imgAsra: img.asra,
               imgMid: midDataURL,
               midSize: Math.floor(midDataURL.length * .75 / 1000),
               imgTiny: tinyDataURL,
               tinySize: Math.floor(tinyDataURL.length * .75 / 1000)
            }

            _elC[collector.imgId] = collector.imgMid;
            console.log(collector.imgId)

            i++;  // iterate before function call
            abPrime.appendMedia(collector, i, fileCount);

            fileCount > i && renderImages();

         }, {passive: true, once: true });
      }
   }
   renderImages();


   









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