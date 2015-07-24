//node /Users/steve.snasdell/Documents/BluePrinting/bp_renderer.js client:All%20Blacks%20Blueprint


var args = process.argv
var passedArguments = {};

args.forEach(function (val, index, array) {
  //console.log(index + ': ' + val+ ': ' + array);
  if ( index==2){
  	//passedArguments = val

  	var properties = val.split(',');
	properties.forEach(function(property) {
	    var tup = property.split(':');
	    passedArguments[tup[0]] = decodeURI(tup[1]);
	});


  }
});

console.log(passedArguments)




var imagesToLoad = []




/*


var PDFDocument = require('pdfkit');
var http = require('http');
var fs = require('fs');
var doc = new PDFDocument;

http.createServer(function(req, res) {
  // This opens up the writeable stream to `output`
  var stream = fs.createWriteStream('/Users/steve.snasdell/Documents/BluePrinting/output.pdf');

  // This pipes the POST data to the file
  doc.pipe(stream);
  doc.circle(100, 50, 50).stroke();

  // After all the data is saved, respond with a simple html form so they can post more data
  req.on('end', function () {
    doc.pipe(res);   
    doc.end();
  });

  // This is here incase any errors occur
  writeStream.on('error', function (err) {
    console.log(err);
  });
}).listen(8080);


//# add stuff to PDF here using methods described below...

//# finalize the PDF and end the stream

*/

//var Tabletop = require('/Users/steve.snasdell/Documents/BluePrinting/js/tabletop.js');
var Tabletop = require(passedArguments.outputfolder + 'js/tabletop.js');


//var Tabletop = require('/Users/steve.snasdell/Documents/BluePrinting/js/tabletop.js');

//var testURL = 'https://docs.google.com/spreadsheets/d/1AHF_-URC-w8urzNGx_sLrNCi8yR9xkaVdr3Rr0ojMBY/pubhtml';
var testURL = 'https://' + passedArguments.sheet ;



function onLoad(data, tabletop) {
 // console.log(data);

  buildPDF(tabletop)
};

var options = {
  key: testURL,
  callback: onLoad
};


function drawTimeline(vx,vy,vw,vh,text){

	//das
	
	doc.lineWidth(4)
	doc.strokeColor("red")
	doc.moveTo(vx,vy+20)
	doc.lineTo(vx,vy+60)
	doc.stroke()
	if ( text.toLowerCase() == "dash"){
		doc.dash(10,{space:10})
		text = ""
	}
	doc.moveTo(vx,vy+40)
	doc.lineTo(vx+vw,vy+40)
	doc.stroke()
	doc.undash()
	doc.moveTo(vx+vw,vy+20)
	doc.lineTo(vx+vw,vy+60)
	doc.stroke()
	//
	doc.font('Helvetica-Bold')
	doc.fontSize(20)
	doc.fillColor('black')
	doc.text(text, vx+20,vy+10,{width:vw - 40,align:'center'})
}


function drawTrainline(vx,vy,vw,vh,text,boxWidth){
	doc.lineWidth(4)
	doc.strokeColor("green")

	if ( text =="start"){
		doc.moveTo(vx + (boxWidth/2),vy + (vh/2))
		doc.lineTo(vx + (vw) ,vy + (vh/2))
		doc.stroke();

		doc.lineWidth(6)
		doc.circle(vx + (boxWidth/2), vy + (vh/2), vh/3)
		doc.fillAndStroke("white","black");
	}
	if ( text =="stop"){
		doc.moveTo(vx,vy + (vh/2))
		doc.lineTo(vx + (vw) ,vy + (vh/2))
		doc.stroke();

		doc.lineWidth(6)
		doc.circle(vx + (boxWidth/2), vy + (vh/2), vh/3)
		doc.fillAndStroke("white","green");
	}
	if ( text =="terminus"){
		doc.moveTo(vx ,vy + (vh/2))
		doc.lineTo(vx + (boxWidth/2) ,vy + (vh/2))
		doc.stroke();

		doc.lineWidth(6)
		doc.circle(vx + (boxWidth/2), vy + (vh/2), vh/3)
		doc.fillAndStroke("white","black");
	}



	
}

function drawBlock(vx,vy,vw,vh,text){

	//adds Image to stack to load
	var imageCheck = isItImage(text)
	if ( imageCheck){
		var newImageToLoad = [imageCheck,vx,vy,vw,vh,curPage]
		imagesToLoad.push(newImageToLoad)
		return;
	}
	//

	doc.lineWidth(1)
 	doc.strokeColor("#000000")
 	doc.fillColor("#ffffff")
  	doc.rect(vx,vy,vw,vh).fillAndStroke();
	

  	doc.font('Helvetica')
	doc.fontSize(18)
  	doc.fillColor('black')
 	doc.text(text, vx+20,vy + 20,{width:vw - 40,height:vh - 40,align:'left'});

 	

}


function drawEnabler(vx,vy,vw,vh,text){

	
 	doc.fillColor("#999999")
  	doc.rect(vx,vy,vw,vh).fill();
  	doc.fillColor("#333")
  	doc.rect(vx,vy,10,vh).fill();
	

  	doc.font('Helvetica')
	doc.fontSize(18)
  	doc.fillColor('white')
 	doc.text(text, vx+30,vy + 20,{width:vw - 50,height:vh - 30,align:'left'});

 	

}

function drawBulletBlock(vx,vy,vw,vh,text){

	

	

 	var newText = text.split(".");
	//var build


	doc.lineWidth(1)
 	doc.strokeColor("#e4e4e4")
  	doc.rect(vx,vy,vw,vh).stroke();
	

  	doc.font('Helvetica')
	doc.fontSize(18)
  	doc.fillColor('black')
 	//doc.text(text, vx+20,vy + 20,{width:vw - 40,height:vh - 40,align:'left'});

 //doc.moveTo(vx+20,vy + 20);
	for ( var db = 0 ; db < newText.length; db ++){
 		if ( db == 0 ){
			doc.text("• " + newText[db],vx+20,vy + 20,{width:vw - 50,height:vh - 40,align:'left',paragraphGap:5});		
 		}else{
 			doc.text("• " + newText[db],{width:vw - 40,height:vh - 50,align:'left',paragraphGap:5});			
 		}
	}

}




function drawCustomerBlock(vx,vy,vw,vh,text,tillNext){


	
	

	doc.lineWidth(4)
 	doc.strokeColor("black")
  	doc.rect(vx,vy,vw,vh).stroke();
	

  	doc.font('Helvetica-Bold')
	doc.fontSize(18)
  	doc.fillColor('black')
 	doc.text(text, vx+20,vy + 20,{width:vw - 40,height:vh - 40,align:'left'});

 	//how to handle a svg remember to convert shape to path see code at bottom 
 	/*
 	doc.save()
 	doc.lineWidth(10)
 	doc.fillColor('black')
 	doc.translate(vx,vy).path('M209.5,87.5L93.1 0 93.1 28.8 0 28.8 0 146.3 93.1 146.3 93.1 175.1 z')
 	doc.fill()
 	doc.restore();
	*/

	//console.log(tillNext)
	if ( tillNext != 0 ){

		var stopx = tillNext - 30

		doc.save()
		doc.lineWidth(2)
		doc.fillColor("black")

		doc.moveTo(vx+vw,(vy+(vh/2))-10 )
		doc.lineTo(vx+vw+stopx + 15,(vy+(vh/2))-10 )
		doc.lineTo(vx+vw+stopx + 15,(vy+(vh/2))+10 )
		doc.lineTo(vx+vw,(vy+(vh/2))+10 )
		doc.lineTo(vx+vw,(vy+(vh/2))-10 )

		doc.moveTo(vx+vw + tillNext +15, vy+(vh/2) )
		doc.lineTo(vx+vw+stopx+15,(vy+(vh/2))-20 )
		doc.lineTo(vx+vw+stopx+15,(vy+(vh/2))+20 )
		doc.lineTo(vx+vw + tillNext +15, vy+(vh/2) )
		
		doc.fill()
		doc.restore()

	}


 	

}


function drawTitleBlock(vx,vy,vw,vh,text){

	if (text != "_"){

		doc.lineWidth(1)
		doc.strokeColor("#b9b7ba")
		doc.fillColor("#fbfbfb")
	  	//doc.rect(vx,vy,vw,vh).fillAndStroke('#fbfbfb',"#b9b7ba");

	  	//doc.rect(vx,vy,vw,vh).fill("#f5f2ef");
	  	doc.rect(vx,vy,vw,vh).fill("#e4e4e4");
	  

	  	doc.font('Helvetica-Bold')
		doc.fontSize(30)
	  	doc.fillColor('black')
	 	doc.text(text.toUpperCase(), vx+20,vy + 28,{width:vw - 40,height:vh - 40,align:'center'});

 	}

}
function drawRowTitle(vx,vy,vw,text){

	
  

  	doc.font('Helvetica-Bold')
	doc.fontSize(14)
  	doc.fillColor('black')
 	doc.text(text.toUpperCase(), vx+20,vy + 20,{width:vw - 60,align:'left'});

 	

}

function drawLine(vx,vy,vw,vh,type,text){
	
	doc.lineWidth(vh)
	doc.strokeColor("black")
	doc.moveTo(vx,vy)
	doc.lineTo(vx+vw,vy)

	if (type =="solid"){
		doc.undash()
		doc.stroke()
	}
	if (type =="dashed"){
		doc.dash(10,{space:10})
		doc.stroke()
	}
	if (type =="dotted"){
		doc.dash(2,{space:10})
		doc.stroke()
	}
	doc.undash()


	if ( text.substr(0,4).toLowerCase() != "line"){
		text = "";
	}
	
	doc.font('Helvetica-Oblique')
	doc.fontSize(14)
  	doc.fillColor('#999999')
 	doc.text(text, vx+20,vy-20,{align:'left'});

 	

}

function drawEnablerLine(vx,vy,vw,vh,text){

	  	doc.rect(vx,vy,vw,vh).fill("#cccccc");

}

function drawGradientStrip(vx,vy,vw,vh,pageHeight){
	vh = (pageHeight - vy)

	console.log ("pageHeight " + pageHeight )
	console.log ("vy " + vy )
	
	doc.save()
	
	grad = doc.linearGradient(vx, vy, vx, vy + (vh))
	//grad.stop(0, '#ededed').stop(1, 'white')
	grad.stop(0, '#e4e4e4').stop(.5, '#e4e4e4').stop(1, '#e4e4e4')


	

	doc.rect(vx,vy,vw,vh).fill(grad);
 	
 	doc.restore()

}


function buildConnections(cons,blocks){

	for ( var i = 0 ; i < cons.length; i++){

		var start = cons[i][0]
		var end = cons[i][1];

		var startBlockref = blocks[start]
		var endBlockref = blocks[end]

		var direction = "down"
		if ( startBlockref[1] > endBlockref[1] ){
 			direction = "up"
		}
		if ( startBlockref[0] > endBlockref[0] ){
 			direction = "left"
		}
		if ( startBlockref[0] < endBlockref[0] ){
 			direction = "right"
		}

		
		doc.save()

		doc.lineWidth(5)
		doc.strokeColor("#58acec")
		doc.fillColor("#58acec")


		if ( direction == "down"){
			doc.moveTo(startBlockref[0] + (startBlockref[2]/2)  ,  startBlockref[1] + (startBlockref[3]) - 10 ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1]   ) 
			doc.stroke()

			doc.moveTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1] -10  ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2) +10 ,  endBlockref[1] -10  ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1] + 15   ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2) -10 ,  endBlockref[1]  -10 ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1]  -10 ) 
			doc.fill()

		}

		if ( direction == "up"){
			doc.moveTo(startBlockref[0] + (startBlockref[2]/2)  ,  startBlockref[1]  + 10 ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1] + (endBlockref[3])   ) 
			doc.stroke()

			doc.moveTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1]+ (endBlockref[3]) +10  ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2) +10 ,  endBlockref[1] + (endBlockref[3])+10  ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1]+ (endBlockref[3]) - 15   ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2) -10 ,  endBlockref[1] + (endBlockref[3]) +10 ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1] + (endBlockref[3]) +10 ) 
			doc.fill()

		}

		if ( direction == "right"){
			doc.moveTo(startBlockref[0] + (startBlockref[2]) - 10 ,  startBlockref[1] + (startBlockref[3]/2)   ) 
			doc.lineTo(endBlockref[0]  ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.stroke()

			doc.moveTo(endBlockref[0] -10 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.lineTo(endBlockref[0] -10 ,  endBlockref[1] + (endBlockref[3]/2) - 10   )
			doc.lineTo(endBlockref[0] +15 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.lineTo(endBlockref[0] -10 ,  endBlockref[1] + (endBlockref[3]/2) +10  )
			doc.lineTo(endBlockref[0] -10 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.fill() 

		}


		if ( direction == "left"){
			doc.moveTo(startBlockref[0] + 10 ,  startBlockref[1] + (startBlockref[3]/2)   ) 
			doc.lineTo(endBlockref[0]   + (endBlockref[2])  ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.stroke()

			doc.moveTo(endBlockref[0] + (endBlockref[2]) +10 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.lineTo(endBlockref[0]+ (endBlockref[2])  +10 ,  endBlockref[1] + (endBlockref[3]/2) + 10   )
			doc.lineTo(endBlockref[0] + (endBlockref[2]) -15 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.lineTo(endBlockref[0] + (endBlockref[2]) +10 ,  endBlockref[1] + (endBlockref[3]/2) -10  )
			doc.lineTo(endBlockref[0] + (endBlockref[2]) +10 ,  endBlockref[1] + (endBlockref[3]/2)   )
			doc.fill() 

		}
		


		/*
		
		doc.moveTo(startBlockref[0] + (startBlockref[2]/2)  ,  startBlockref[1] + (startBlockref[3]/2)   ) 
			doc.lineTo(endBlockref[0] + (endBlockref[2]/2)  ,  endBlockref[1] + (endBlockref[3]/2)   ) 


		doc.lineTo(vx+vw+stopx,(vy+(vh/2))+10 )
		doc.lineTo(vx+vw,(vy+(vh/2))+10 )
		doc.lineTo(vx+vw,(vy+(vh/2))-10 )


		doc.moveTo(vx+vw + tillNext , vy+(vh/2) )
		doc.lineTo(vx+vw+stopx,(vy+(vh/2))-20 )
		doc.lineTo(vx+vw+stopx,(vy+(vh/2))+20 )
		doc.lineTo(vx+vw + tillNext , vy+(vh/2) )
		*/

		



		
		
		doc.restore()
		
		//console.log ( startBlockref)


	}




}


function isItImage(t){

	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);
	var result = ""

	  if (t.match(regex) )
	 {
	 	result = t.match(regex)[0]
	  // console.log(t.match(regex)[0] );

	  // console.log (checkURL(result) )

	   if (checkURL(result)){

	   	return result
	   }else{
	   	return null
	   }
	 } else {
	  // console.log("No match");
	   return null
	 }

}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}



/**/


var curPage = 0;


function buildPDF(tabletop) {

	/*

	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = new RegExp(expression);
	var t = 'http://www.thedrum.com/uploads/news/tmp/980/rugbyworldcup.jpeg sds di oaSIDH aosdh aSDI ';


	  if (t.match(regex) )
	 {
	   console.log(t.match(regex)[0] );
	 } else {
	   console.log("No match");
	 }
	 */
	 
//isItImage('http://www.thedrum.com/uploads/news/tmp/980/rugbyworldcup.jpg sds di oaSIDH aosdh aSDI ')





	var PDF = require('pdfkit');            //including the pdfkit module
	var fs = require('fs');
	var text = 'ANY_TEXT_YOU_WANT_TO_WRITE_IN_PDF_DOC';

	doc = new PDF({size:[1000,200],bufferPages:"true"});                        //creating a new PDF object
	doc.pipe(fs.createWriteStream(passedArguments.outputfolder+'output.pdf'));  //creating a write stream 
	doc.save()
	            //to write the content on the file system

//	forEach( tabletop.sheets(), function(i, sheet) {

	//console.log ( tabletop.foundSheetNames)
 	

     var title = 0
     var boxWidth = 250;
     var boxHeight = 160;
     var boxpadding = 40;

  var titleBoxHeight = 80;
  var timeBoxHeight = 80;
  var lineHeight = 1;

  var trainlineHeight = 40;
  var enablerHeight = 80;
 	
	for (var key in tabletop.foundSheetNames) {
		
   //var obj = tabletop.sheets(tabletop.foundSheetNames[key]);
  		  var curSheet = tabletop.sheets(tabletop.foundSheetNames[key]);
  
  		  

  		  var blocks = {};
  		  var connections = []
         

          var arr = curSheet.all()



          var pageWidth = (boxWidth * arr.length) + ((arr.length)*boxpadding);
          var pageHeight = 400

          for (var r = 0 ; r < curSheet.column_names.length; r ++){
          	if (arr[0][curSheet.column_names[r]] != "omit"){
				//
				if (arr[0][curSheet.column_names[r]] == "cappedLine"){
  					pageHeight +=  timeBoxHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "lineSolid"){
  					pageHeight +=  lineHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "lineDotted"){
  					pageHeight +=   lineHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "lineDashed"){
  					pageHeight +=   lineHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "regular"){
  					pageHeight +=  boxHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "bullet"){
  					pageHeight +=  boxHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "customerAction"){
  					pageHeight +=  boxHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "title"){
  					pageHeight +=  titleBoxHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "trainline"){
  					pageHeight +=  trainlineHeight + boxpadding
  				}
  				if (arr[0][curSheet.column_names[r]] == "enabler"){
  					pageHeight +=  enablerHeight + boxpadding
  				}
  				//
          	}
          }
          console.log (pageHeight )


           doc.addPage({size:[pageWidth+200,pageHeight]})
           curPage ++;


           if ( passedArguments.client){
			doc.font('Helvetica')
			doc.fontSize(30)
		  	doc.fillColor('#000')
		 	doc.text( passedArguments.client.toUpperCase()  , 390,100,{align:'left'});
		 
		 

           }

			doc.font('Helvetica')
			doc.fontSize(60)
		  	doc.fillColor('black')
			doc.text((Number(key)+1) +". "+curSheet.name, 390,180,{align:'left'});

          

          rowIndex = 0

         // console.log ( curSheet.column_names )

          var colIndex = 100
   		  var rowIndex = 300

   		  var tempRowHeight = 0

          //console.log(arr[0])
          

//console.log ( curSheet.all() )

        for (var i = 0 ; i < arr.length; i ++){




          	for (var r = 0 ; r < curSheet.column_names.length; r ++){

          			//console.log("colName: "+curSheet.column_names[r])
          			//get content of cell
          			title = arr[i][curSheet.column_names[r]];
          			//console.log ( title )

          			//should I omit this
          			if (arr[0][curSheet.column_names[r]] != "omit"){
          				
	          			

          				if (arr[0][curSheet.column_names[r]] == "cappedLine"){
          					tempRowHeight =  timeBoxHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "lineSolid"){
          					tempRowHeight =  lineHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "lineDotted"){
          					tempRowHeight =  lineHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "lineDashed"){
          					tempRowHeight =  lineHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "regular"){
          					tempRowHeight = boxHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "bullet"){
          					tempRowHeight = boxHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "customerAction"){
          					tempRowHeight = boxHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "title"){
          					tempRowHeight = titleBoxHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "trainline"){
          					tempRowHeight = trainlineHeight
          				}
          				if (arr[0][curSheet.column_names[r]] == "enabler"){
          					tempRowHeight = enablerHeight
          				}

          				//firstColumn
          				if ( i == 0 ){
          					//title should be column header
          					title = curSheet.column_names[r];
          					// drawthelines
							
							var lineWidth = (boxWidth * arr.length) + ((arr.length)*boxpadding)



							if (arr[0][curSheet.column_names[r]] == "lineSolid"){
	          					drawLine(colIndex,rowIndex,lineWidth,lineHeight,"solid",title)
	          				}
	          				if (arr[0][curSheet.column_names[r]] == "lineDotted"){
	          					drawLine(colIndex,rowIndex,lineWidth,lineHeight,"dotted",title)
	          				}
	          				if (arr[0][curSheet.column_names[r]] == "lineDashed"){
	          					drawLine(colIndex,rowIndex,lineWidth,lineHeight,"dashed",title)
	          				}
	          				if ( title.toLowerCase() == "line of visibility"){
          						drawGradientStrip(colIndex,rowIndex,lineWidth,boxpadding,pageHeight - 100 )
          					}


          					if (arr[0][curSheet.column_names[r]] == "enabler"){
          						console.log ( "sdsdsdsds")
	          					drawEnablerLine(colIndex + boxWidth + boxpadding,rowIndex,lineWidth - boxWidth - boxpadding,enablerHeight,title)
	          				}




          				}

	          			



	          			if (title != "" && title != "~" ){


	          				var initSearch = i + 1
	          				var multiplier = 1
	          				for (var s = initSearch; s < arr.length; s++){
	          					if (arr[s][curSheet.column_names[r]] == "~"  ){
	          						//console.log("here")
	          						multiplier += 1
	          						//console.log(multiplier)
	          					}else{
	          						//stop search
	          						s = arr.length
	          					}

	          				}
	          				//console.log(multiplier + " " + title)
	          				
		          				var newWidth = (boxWidth * multiplier) + ((multiplier-1)*boxpadding)
		          				//console.log("build")
		          				//console.log(multiplier)
		          				/*
		          				if ( curSheet.column_names[r] == "Time"){
		          					 drawTimeline(colIndex,rowIndex,newWidth,10,title)

		          				}else if (curSheet.column_names[r] == "Touch point"){
		          					drawTitleBlock(colIndex,rowIndex,newWidth,titleBoxHeight,title)
		          				}else{
		          					drawBlock(colIndex,rowIndex,newWidth,boxHeight,title)
		          				}
								*/

								if ( i != 0 ){

									var isBlock = false;

									var isEnd = false;


									var newLabel = String.fromCharCode(65 + r) +""+ String(i+2);

									//var test = title.match(/{(.*)}/);
									var test = title.match(/\*(.*)/);

									if ( test ){
										//var splitOff = title.substr( title.indexOf('{{'), title.indexOf('}}')); 

										//title = title.substr(0, title.indexOf('{{') ); 

										//var test = title.match(/{(.*)}/);
									//if ( splitOff == ""){
										//console.log ( title.indexOf('{{') )
										//console.log ("found arrow")

										
										//console.log (test)
										title = title.substr(0, test.index ); 
										/*
										console.log ("from "+ newLabel)
										var length = splitOff.length
										console.log ( length )
										console.log ("to"+ splitOff.substr(2,length))
										console.log ("left "+ title)
										*/
										//console.log ("from "+ newLabel)
									//	console.log ("to"+ test[1] )
									//	console.log ("left "+ title)


										for ( var con = 0; con < test[1].split(",").length; con ++){

											if ( test[1].split(",")[con] =="|"){
												//console.log("This is the end")
												isEnd = true
											}else{

												var direction = test[1].split(",")[con].substr(0,1);
												var value = Number(test[1].split(",")[con].substr(1));

												//console.log ("direction:" + direction);
												//console.log ("value:" + value);

												//console.log ( con )
												//console.log ( test[1].split(",")[con] )
												var destLabel 
												if (direction == "+"){
													destLabel = String.fromCharCode(65 + r) +""+ (String(i+2 - value));	
												}
												if (direction == "-"){
													destLabel = String.fromCharCode(65 + r) +""+ (String(i+2+ value) );;	
												}
												if (direction == ">"){
													//console.log ("here" + (r + value) )
													destLabel = String.fromCharCode(65 + (r + value)) +""+ String(i+2);	
												}
												if (direction == "<"){
													destLabel = String.fromCharCode(65 + (r - value)) +""+ String(i+2);	
												}
												
												//console.log ( destLabel )

												connections.push( [newLabel , destLabel ])


											}

										}



									//}
									}
									//console.log(connections)
									//
									if (arr[0][curSheet.column_names[r]] == "trainline"){
			          					drawTrainline(colIndex,rowIndex,newWidth + boxpadding,trainlineHeight,title, boxWidth)
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "enabler"){
			          					drawEnabler(colIndex,rowIndex,newWidth,enablerHeight,title)
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "cappedLine"){
			          					drawTimeline(colIndex,rowIndex,newWidth,10,title)
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "regular"){
			          					drawBlock(colIndex,rowIndex,newWidth,boxHeight,title)
			          					isBlock = true;
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "bullet"){
			          					drawBulletBlock(colIndex,rowIndex,newWidth,boxHeight,title)
			          					isBlock = true;
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "customerAction"){


			          					var tillNext = 0
				          				for (var s = i + 1; s < arr.length; s++){
				          					if (arr[s][curSheet.column_names[r]] == "" ){
				          						//console.log("here")
				          						tillNext += 1
				          						//console.log(multiplier)
				          					}else{
				          						//stop search
				          						s = arr.length
				          					}

				          				}

				          				var tillNextWidth = (boxWidth * tillNext) + ((tillNext+1)*boxpadding)

				          				//console.log(isEnd);
				          				if (isEnd){
				          					tillNextWidth = 0;
				          				}

			          					drawCustomerBlock(colIndex,rowIndex,newWidth,boxHeight,title,tillNextWidth)

			          					isBlock = true;
			          				}
			          				if (arr[0][curSheet.column_names[r]] == "title"){
			          					drawTitleBlock(colIndex,rowIndex,newWidth,titleBoxHeight,title)
			          				}

			          				if ( isBlock ){
				          				blocks[newLabel] = [colIndex,rowIndex,newWidth,boxHeight];
			          				}
			          				


		          				}else{
		          					if (arr[0][curSheet.column_names[r]] != "lineSolid" &&arr[0][curSheet.column_names[r]] != "lineDashed" &&arr[0][curSheet.column_names[r]] != "lineDotted" ){
		          						drawRowTitle(colIndex,rowIndex,newWidth,title)
		          						
		          					}
		          				}





		          				/*
			          			doc.lineWidth(2)
							 	doc.strokeColor("black")
							  	doc.rect(colIndex,rowIndex,newWidth,160).stroke();
								

							  	doc.font('Helvetica')
								doc.fontSize(18)
							  	doc.fillColor('black')
							 	doc.text(title, colIndex+20,rowIndex + 20,{width:newWidth - 40,align:'left'})
							 	*/
						 	
					 	}

					 	rowIndex += (tempRowHeight + boxpadding)


				 	}
          	}
			//drawCOlumnEndLine
			/*
			doc.lineWidth(1)
			doc.strokeColor("#ccc")
			doc.moveTo(350,200)
			doc.lineTo(350,rowIndex)
			doc.undash()
			doc.stroke()
			*/

          	rowIndex = 300
          	colIndex += (boxWidth + boxpadding) 




          	




		  	

          }
         // console.log ( blocks ) 

        // console.log ( connections ) 

         buildConnections(connections,blocks)
          
          

		  



		  


/*
   for (var prop in obj) {
      console.log(prop + " = " + obj[prop]);
   }
  */ 
   //console.log(tabletop.foundSheetNames[key])
}



 	/*
 	var m = 	tabletop.sheets()
 	m.forEach(function(i,sheet){

 		console.log(sheet.name)
 	})
	tabletop.sheets().each(function(i,sheet){
          //$("#table_info").append("<p>" + sheet.name + " has " + sheet.column_names.join(", ") + "</p>");

          var title = sheet.name;
          doc.addPage({size:[1000,200]})
		  doc.text(title, 100, 100);
		  


    });

*/


	//doc.addPage({size:[1000,200]})
	//doc.text(text, 100, 100);             //adding the text to be written,
	//doc.circle(100, 50, 50).dash(5,{space:30}).stroke() 
	            // more things can be added here including new pages
	
	addAnyImagesAndEnd()

	//setTimeout(function() { endPDF(); }, 10000);


}

function addAnyImagesAndEnd(){

	console.log ( imagesToLoad )
	if (imagesToLoad.length > 0 ){

		var num = imagesToLoad.length

		var useThis = imagesToLoad.pop()
		


		var http = require('http')
		  , fs = require('fs')
		  , options

		
		options = useThis[0]

		var request = http.get(options, function(res){
		    var imagedata = ''
		    res.setEncoding('binary')

		    res.on('data', function(chunk){
		        imagedata += chunk
		    })

		    res.on('end', function(){

		    	//doc.image(imagedata,vx,vy, {width: vw} )

		    	//console.log ( imagedata)

		    	fs.writeFile(passedArguments.outputfolder + 'tempory'+num+'.jpg', imagedata, 'binary', function(err){
		            if (err){
		            	throw err
		            }
		            console.log('File saved.');
		            //callthis()
		           // setTimeout(function() { callthis(vx,vy,vw,vh,text,tillNext); }, 5000);
		        	//console.log(doc);
		        	doc.switchToPage( useThis[5] )
			        doc.image(passedArguments.outputfolder + 'tempory'+num+'.jpg',useThis[1],useThis[2], {fit: [useThis[3],useThis[4]] } )

			        addAnyImagesAndEnd()
		        })

		    })

		})
		request.on('error', function(e) {
		  console.log('error: ' + e.message);
		});
		request.end();








	}else{
		doc.end(); //we end the document writing.
		console.log ("doc has ended")
	}

	
	/*
	var http = require('http')
		  , fs = require('fs')
		  , options

		
		options = imageCheck

		var request = http.get(options, function(res){
		    var imagedata = ''
		    res.setEncoding('binary')

		    res.on('data', function(chunk){
		        imagedata += chunk
		    })

		    res.on('end', function(){

		    	//doc.image(imagedata,vx,vy, {width: vw} )

		    	//console.log ( imagedata)

		    	fs.writeFile('/Users/steve.snasdell/Documents/BluePrinting/tempory.jpg', imagedata, 'binary', function(err){
		            if (err){
		            	throw err
		            }
		            console.log('File saved.');
		            //callthis()
		           // setTimeout(function() { callthis(vx,vy,vw,vh,text,tillNext); }, 5000);
		        	//console.log(doc);
		        	doc.switchToPage(1)
			        doc.image('/Users/steve.snasdell/Documents/BluePrinting/tempory.jpg',vx,vy, {width: vw} )
		        })

		    })

		})
		request.on('error', function(e) {
		  console.log('error: ' + e.message);
		});
		request.end();


		*/

}


function endPDF(){
	doc.end(); //we end the document writing.
	console.log ("doc has ended")


}

Tabletop.init(options);










/*



Open your SVG in a web browser.
Run this code:

var polys = document.querySelectorAll('polygon,polyline');
[].forEach.call(polys,convertPolyToPath);

function convertPolyToPath(poly){
  var svgNS = poly.ownerSVGElement.namespaceURI;
  var path = document.createElementNS(svgNS,'path');
  var points = poly.getAttribute('points').split(/\s+|,/);
  var x0=points.shift(), y0=points.shift();
  var pathdata = 'M'+x0+','+y0+'L'+points.join(' ');
  if (poly.tagName=='polygon') pathdata+='z';
  path.setAttribute('d',pathdata);
  poly.parentNode.replaceChild(path,poly);
}
Using the Developer Tools (or Firebug) of the browser, use "Copy as HTML" (or Copy SVG) on the element to get the modified source onto the clipboard.

Paste into a new file and enjoy.




*/

