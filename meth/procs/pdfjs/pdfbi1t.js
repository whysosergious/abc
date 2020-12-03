// namespace "abPdf"[aptbit pdf script]


if (!window.abPdf) {
  window.abPdf = Object.create(null);
}

// const shroud = document.getElementById("tempshroud");
// const fileLoader = document.getElementById("fileloader");


// dependancies class


// async load function
function hello() { 


    // tt();

  return "pdfbit ready";
  
}




abPdf.ttt = () => {



  pdfjsLib.GlobalWorkerOptions.workerSrc = "meth/procs/pdfjs/pdf.worker.js";

  abKey.fileLoader.onchange = (ev)=>{
    let file = URL.createObjectURL(abKey.fileLoader.files[0]);
    
    renderPDF(file);
  }
  
  function renderPDF(url) {

    let loadingTask = pdfjsLib.getDocument(url);
    console.log(url)
    loadingTask.promise.then(function(pdf) {
      
      let pageCount = pdf._pdfInfo.numPages;
      console.log(file)
      for (let i=1; i<=pageCount; i++) {

        pdf.getPage(i).then(function(page) {
        let scale = 1.5;
        let viewport = page.getViewport({ scale: scale, });

        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        page.render(renderContext);
        canvas.title = "page" + i;
        shroud.appendChild(canvas);
        // console.log(page);
        });
      }
    });
  }
}