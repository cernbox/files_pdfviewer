function PDF_closePublicFileCallback()
{
	$('#imgframe').empty();
	$('#imgframe').text('Reloading...');
	window.location.reload();
}

function PDF_loadFile(file, dir)
{
	var urlD = OC.filePath('files_pdfviewer', 'ajax', 'loadfile.php') + "?file=" + encodeURIComponent(file) 
		+ "&dir=" + encodeURIComponent(dir) + "&requesttoken=" + encodeURIComponent(oc_requesttoken);
	
	if($('#isPublic').attr('value') == '1')
	{
		urlD = urlD + "&token=" + encodeURIComponent($('#sharingToken').attr('value'));
	}
	
	$('#pdfviewer-loader').remove();
	
	var frame = $('#pdfviewer-frame');
	frame.attr('type', 'application/pdf');
	frame.attr('src', urlD);
	frame.contents().find('title').html(file);
	frame.on('load', function()
	{
		document.title = file;
	});
}

function PDF_loadPublicFile(token)
{
	var urlD = OC.filePath('files_pdfviewer', 'ajax', 'loadpublicfile.php') + "?token=" + encodeURIComponent(token) 
	+ "&requesttoken=" + encodeURIComponent(oc_requesttoken);

	$('#pdfviewer-loader').remove();
	
	var frame = $('#pdfviewer-frame');
	frame.attr('type', 'application/pdf');
	frame.attr('src', urlD);
}

/**
 * Set up all html elements needed to display the notebook
 */
function PDF_setUpEditor(closeCallBack)
{
	isPDFViewerOpen =  true;
	var mainDiv = $('#pdfviewer');
	if(mainDiv.length < 1)
	{
		mainDiv = $('<div id="pdfviewer"></div>');
		mainDiv.css('position', 'absolute');
		mainDiv.css('top', '0');
		mainDiv.css('left', '0');
		mainDiv.css('width', '100%');
		mainDiv.css('height', '100%');
		mainDiv.css('z-index', '200');
		mainDiv.css('background-color', '#fff');
		
		var frame = $('<iframe id="pdfviewer-frame"></iframe>');
		frame.css('position', 'absolute');
		frame.css('top', '0');
		frame.css('left', '0');
		frame.css('width', '100%');
		frame.css('height', '100%');
		
		mainDiv.append(frame);
		$('#content').append(mainDiv);
	}
		
	var loadingImg = $('<div id="pdfviewer-loader"></div>');
	loadingImg.css('position', 'absolute');
	loadingImg.css('top', '50%');
	loadingImg.css('left', '50%');
	loadingImg.css('width', 'auto');
	loadingImg.css('height', 'auto');
	var img = OC.imagePath('core', 'loading-dark.gif');
	var imgContent = $('<img></img>');
	imgContent.attr('src',img);
	loadingImg.append(imgContent);
	
	var closeButton = $('<div></div>');
	closeButton.css('position', 'absolute');
	closeButton.css('top', '0');
	closeButton.css('left', '95%');
	closeButton.css('width', 'auto');
	closeButton.css('height', 'auto');
	closeButton.css('z-index', '200');
	closeButton.css('background-color', '#f00');
	var closeImg = OC.imagePath('core', 'actions/close.svg');
	var closeImgContent = $('<img></img>');
	closeImgContent.attr('src', closeImg);
	closeButton.append(closeImgContent);
	
	closeButton.click(function() { PDF_closeFile(closeCallBack); });
	
	$('#app-navigation').hide();
	$('#app-content').hide();
	
	mainDiv.append(loadingImg);
	mainDiv.append(closeButton);
}

/**
 * Open the notebook viewer and displays the notebook given the directory where it belongs and it's name
 * @param directory
 * @param file
 */
function PDF_openFile(directory, file)
{
	PDF_setUpEditor();
	PDF_loadFile(file, directory);
}

/**
 * Open the notebook viewer and displays the notebook given by a publically shared by link
 * @param token
 */
function PDF_openPublicFile(token)
{
	PDF_setUpEditor(closePublicFileCallback);
	PDF_loadPublicFile(token);
}


function PDF_closeFile(callback)
{
	if(isPDFViewerOpen)
	{
		$('#pdfviewer').remove();
		$('#app-navigation').show();
		$('#app-content').show();
		isPDFViewerOpen = false;
		
		if(callback)
		{
			callback();
		}
	}
}

var isPDFViewerOpen = false;
$(document).ready(function () 
{
	if (typeof FileActions !== 'undefined') 
	{
		FileActions.setDefault('application/pdf', 'Edit');
        OCA.Files.fileActions.register('application/pdf', 'Edit', OC.PERMISSION_READ, '', function (filename) 
        {
        	PDF_openFile(FileList.getCurrentDirectory(), filename);
        });
	}
});