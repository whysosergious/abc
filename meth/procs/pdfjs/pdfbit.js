// abPdf object

if (!window.abPdf) {
  window.abPdf = Object.create(null);
}


pdfjsLib.GlobalWorkerOptions.workerSrc = "meth/procs/pdfjs/pdf.worker.js";


function renderPDF(url, el) {
  // console.log(url)
  let loadingTask = pdfjsLib.getDocument(url);
  

  loadingTask.promise.then(function(pdf) {
    
    let pageCount = pdf._pdfInfo.numPages;

    var i = 0;
    const renderPage = function() {
      i++;
      
      pdf.getPage(i).then(async function(page) {

        

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

        var renderTask = page.render({canvasContext: context, viewport: viewport});

        await renderTask.promise.then(function() {
          let imgUrl = canvas.toDataURL('image/jpeg');
          let lastPage = i<pageCount ? false : true;
          abPrime.appendPreview(imgUrl, el, i, pageCount, lastPage);
          i<pageCount && renderPage();
        });
      });
    }
    renderPage();
  });
}