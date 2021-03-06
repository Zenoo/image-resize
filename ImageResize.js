/* exported ImageResize */

/** ImageResize Class used to handle the resizing */
class ImageResize{

    /**
     * Creates an instance of ImageResize
     * and checks for invalid parameters
	 * @param {Object}         [parameters]                      Parameters holder
	 * @param {String|Element} [parameters.source]               Input to automatically resize
	 * @param {Boolean}        [parameters.keepAspectRatio=true] Keep the aspect ratio ?
	 * @param {Number}         [parameters.maxWidth]             Image max width
	 * @param {Number}         [parameters.maxHeight]            Image max height
	 * @param {Number}         [parameters.width]                Image fixed width
	 * @param {Number}         [parameters.height]               Image fixed width
	 * @param {Function}       [parameters.onResize]             Resize callback
     */
    constructor(parameters = {}){
		/**
		 * Parameters holder
		 * @type {Object}
		 * @private
		 */
		this._parameters = {
			source: null,
			keepAspectRatio: true,
			maxWidth: parameters ? null : 50,
			maxHeight: parameters ? null : 50,
			width: null,
			height: null,
			...parameters,
			onResize: parameters.onResize ? [parameters.onResize] : []
		};

		// Used on an input
        if(this._parameters.source){
			/**
			 * Input holder
			 * @type {HTMLInputElement} 
			 * @private 
			 */
			this._input = this._parameters.source instanceof Element ? this._parameters.source : document.querySelector(this._parameters.source);

			// Invalid element
			if(this._input){
				// Not an INPUT
				if(this._input.nodeName == 'INPUT'){
					// Already initialized
					if(this._input.classList.contains('slick-complete-input')){
						console.warn('ImageResize: The element has already been initialized.');
					}else{
						this._build();
						this._listen();
					}
				}else{
					console.warn('ImageResize: '+(typeof target == 'string' ? 'The selector `'+this._parameters.source+'` didn\'t match any input.' : 'The element you provided isn\'t an input.'));
				}
			}else{
				console.warn('ImageResize: '+(typeof target == 'string' ? 'The selector `'+this._parameters.source+'` didn\'t match any element.' : 'The element you provided was undefined'));
			}
		// Used as an empty image processor
		}else{
			this._build();
			this._listen();
		}
    }

    /**
     * Builds the ImageResize utilities
     * @private
     */
    _build(){
		/**
		 * Canvas used to resize
		 * @type {HTMLCanvasElement}
		 * @private
		 */
		this._canvas = document.createElement('canvas');
    }

    /**
     * Creates event listeners
     * @private
     */
    _listen(){
		// Input change
		if(this._input){
			this._input.addEventListener('change', () => {
				const [image] = this._input.files;
	
				if(image.type.match(/image.*/)){
					this._process(image).then(resizedImage => {
						// Call onResize callbacks
						for(const callback of this._parameters.onResize) Reflect.apply(callback, null, [resizedImage]);
					});
				}else{
					console.warn('ImageResize: You tried to resize a non-image file.');
				}
			});
		}
	}
	
	/**
	 * Process the image
	 * @param {File} file The image file
	 * @returns {Promise} Resolved when the image is processed
	 * @private
	 */
	_process(file){
		return new Promise(resolve => {
			const reader = new FileReader();

			// Reader load handler
			reader.addEventListener('load', event => {
				// Special case for SVGs
				if(file.name.endsWith('.svg')){
					// Load the SVG before sending it back
					const unalteredSVG = new Image();
	
					unalteredSVG.addEventListener('load', () => {
						resolve(unalteredSVG);
					});

					unalteredSVG.src = reader.result;
				}else{
					const image = new Image();
	
					// Image load handler
					image.addEventListener('load', () => {
						let {width, height} = image;
		
						const ratio = width / height;
		
						// Scale width down to maxWidth
						if(this._parameters.maxWidth !== null && width > this._parameters.maxWidth){
							width = this._parameters.maxWidth;
		
							// Update height if keepAspectRatio
							if(this._parameters.keepAspectRatio) height = width / ratio;
						}
		
						// Scale height down to maxHeight
						if(this._parameters.maxHeight !== null && height > this._parameters.maxHeight){
							height = this._parameters.maxHeight;
		
							// Update width if keepAspectRatio
							if(this._parameters.keepAspectRatio) width = ratio * height;
						}
		
						// Scale width down to fixed width
						if(this._parameters.width !== null && width > this._parameters.width){
							// eslint-disable-next-line prefer-destructuring
							width = this._parameters.width;
		
							// Update height if keepAspectRatio
							if(this._parameters.keepAspectRatio) height = width / ratio;
						}
		
						// Scale height down to fixed height
						if(this._parameters.height !== null && height > this._parameters.height){
							// eslint-disable-next-line prefer-destructuring
							height = this._parameters.height;
		
							// Update width if keepAspectRatio
							if(this._parameters.keepAspectRatio) width = ratio * height;
						}
		
						// Scale the canvas accordingly
						this._canvas.width = width;
						this._canvas.height = height;
	
						// Reset the canvas
						this._canvas.getContext('2d').clearRect(0, 0, this._canvas.width, this._canvas.height);
	
						// Draw the new image
						this._canvas.getContext('2d').drawImage(image, 0, 0, width, height);
		
						// Get the processed image as dataUrl
						const dataUrl = this._canvas.toDataURL('image/' + file.name.split('.').pop());
		
						// Load the new image before sending it back
						const resizedImage = new Image();
	
						resizedImage.addEventListener('load', () => {
							resolve(resizedImage);
						});
	
						resizedImage.src = dataUrl;
					});
		
					// Trigger the image load
					image.src = event.target.result;
				}
			});
	
			// Trigger the reader load
			reader.readAsDataURL(file);
		});
	}

	/**
	 * Manually process an image
	 * @param {String|File} file The image SRC or the image File itself
	 * @returns {Promise} Resolved with the new Image
	 */
	process(file){
		return new Promise(resolve => {
			let image = null;

			new Promise(solve => {
				if(file instanceof File){
					image = file;
	
					resolve();
				}else{
					fetch(file)
						.then(res => res.blob())
						.then(blob => {
							blob.lastModifiedDate = new Date();
							blob.name = 'resizedImage' + blob.type.split('/').pop();
	
							image = blob;
	
							solve();
						});
				}
			}).then(() => {
				this._process(image).then(resizedImage => {
					resolve(resizedImage);
				});
			});
		});
	}

	/**
	 * Set the resized images max-width
	 * @param {Number} value 
	 * @returns {ImageResize} The current {@link ImageResize}
	 */
	maxWidth(value){
		this._parameters.maxWidth = value;

		return this;
	}

	/**
	 * Set the resized images max-height
	 * @param {Number} value 
	 * @returns {ImageResize} The current {@link ImageResize}
	 */
	maxheight(value){
		this._parameters.maxheight = value;

		return this;
	}

	/**
	 * Set the resized images width
	 * @param {Number} value 
	 * @returns {ImageResize} The current {@link ImageResize}
	 */
	width(value){
		this._parameters.width = value;

		return this;
	}

	/**
	 * Set the resized images height
	 * @param {Number} value 
	 * @returns {ImageResize} The current {@link ImageResize}
	 */
	height(value){
		this._parameters.height = value;

		return this;
	}

	/**
	 * Sets wether the resized images should keep their initial aspect ratio
	 * @param {Boolean} value 
	 * @returns {ImageResize} The current {@link ImageResize}
	 */
	keepAspectRatio(value){
		this._parameters.keepAspectRatio = value;

		return this;
	}
}