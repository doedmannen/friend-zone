import Store from './Store'; 

let ScreenCalc = function(){
	window.addEventListener('resize', () => {
		let size = window.innerWidth, screenSize = {};
		screenSize.XS = size < 600; 
		screenSize.SM = size < 940 && size >= 600; 
		screenSize.MD = size < 1264 && size >= 940; 
		screenSize.LG = size < 1904 && size >= 1264; 
		screenSize.XL = size < Infinity && size >= 1904;
		screenSize.name = Object.keys(screenSize).filter(k => screenSize[k])[0];
		screenSize.isSMorAbove = screenSize.SM || screenSize.MD || screenSize.LG || screenSize.XL; 
		screenSize.isSMorBelow = screenSize.SM || screenSize.XS; 
		screenSize.isMDorAbove = screenSize.MD || screenSize.LG || screenSize.XL; 
		screenSize.isMDorBelow = screenSize.MD || screenSize.SM || screenSize.XS; 
		screenSize.isLGorAbove = screenSize.LG || screenSize.XL; 
		screenSize.isLGorBelow = screenSize.LG || screenSize.MD || screenSize.SM || screenSize.XS;
		screenSize.width = window.innerWidth; 
		screenSize.height = window.innerHeight; 
		Store.setState({screenSize});
	});
}

export default ScreenCalc; 
