import { h, Component } from 'preact';
import Koji from '@withkoji/vcc';
import HoverButton from './ReactButtons.js';

class TutorialPage extends Component {
	render() {
		const VCC = Koji.config.tutorial;

		let pageColor = VCC.background.backgroundColor;
	    let pageStyle = {
	        width:'100%',
	        height:'100%',
	        display:'flex',
	        justifyContent:'center',
	        backgroundSize:'cover',
	        backgroundColor:pageColor
	    };
	    let pageImage = VCC.background.backgroundImage;
	    if(pageImage != "" && pageImage != undefined) {
	      pageStyle = {...pageStyle, backgroundImage:`url(${pageImage})`};
	    }

	    let bannerColor = VCC.banner.backgroundColor;
	    let bannerStyle = {
	        width:'calc(100% - 40px)',
            padding:'10px 20px 10px 20px',
	        display:'flex',
	        justifyContent:'space-between',
	        alignItems:'center',
	        position:'fixed',
	        height:'40px',
	        backgroundColor:bannerColor,
	        top:'0px',
	        borderBottom:'1px solid rgba(0,0,0,.25)'
	    };

	    let backStyle = {
	        postion:'relative',
	        left:'-40%',
	        padding:'10px',
	        border:0,
	        backgroundColor:bannerColor,
	        borderRadius:'2px'
	    };
	    let backImage = <img src={Koji.config.gameScene.backButton.buttonImage} style={{height:'30px',width:'auto'}} />
	    let BackButton = <HoverButton styling={backStyle} content={backImage} callback={() => window.setAppView('intro')}/>

	    let title = VCC.banner.content;
	    let titleColor = VCC.banner.textColor;
	    let titleStyle = {
	        color:titleColor
	    };

	    const GAME_VCC = Koji.config.gameScene;
	    let imageStyle = {
	    	width:'40px',
	    	height:'auto',
	    	margin:'0 5px 0 5px'
	    };

	    let bttnStyle = {
	    	width:'50px',
	    	height:'50px',
	    	padding:'10px',
	    	backgroundColor:'rgb(240,240,240)',
	    	borderRadius:'4px',
	    	marginBottom:'10px'
	    };

	    let pStyle = {
	    	fontSize:'1.25em',
	    	display:'flex',
	    	alignItems:'center'
	    };

	    return(
		    <div style={pageStyle}>
		        <div style={bannerStyle}>
		        	{BackButton}
		        	<h1 style={titleStyle}>{title}</h1>
		        	<div />
		        </div>
		        <div style={{width:'100%',display:'flex',flexDirection:'column',margin:'120px 0 60px 0',alignItems:'center',justifyContent:'space-between'}}>
		        	<p style={pStyle}>Get from <img src={GAME_VCC.entrance} style={imageStyle}/> to <img src={GAME_VCC.exit} style={imageStyle}/>.</p>
		        	<p style={pStyle}>Avoid <img src={GAME_VCC.wall} style={imageStyle}/> and the edges of the level.</p>
		        	<p style={pStyle}>Collect <img src={GAME_VCC.coin} style={imageStyle}/> for an extra challenge.</p>
		        	<div style={{display:'flex',alignItems:'center'}}>
		        		<div style={{display:'flex',flexDirection:'column',margin:'0 15px 15px 15px',alignItems:'center'}}>
		        			<img src={GAME_VCC.singleLine.buttonImage} style={bttnStyle}/>
		        			<p style={pStyle}>Short Line</p>
		        		</div>
		        		<div style={{display:'flex',flexDirection:'column',margin:'0 15px 15px 15px',alignItems:'center'}}>
		        			<img src={GAME_VCC.doubleLine.buttonImage} style={bttnStyle}/>
		        			<p style={pStyle}>Medium Line</p>
		        		</div>
		        		<div style={{display:'flex',flexDirection:'column',margin:'0 15px 15px 15px',alignItems:'center'}}>
		        			<img src={GAME_VCC.trippleLine.buttonImage} style={bttnStyle}/>
		        			<p style={pStyle}>Long Line</p>
		        		</div>
		        	</div>
		        </div>
	      	</div>
	    );
	}
}

export default TutorialPage;