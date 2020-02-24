import { h, Component } from 'preact';
import HoverButton from './ReactButtons.js';

class LevelPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const VCC = Koji.config.levelSelect;
        let pageColor = VCC.background.backgroundColor;
        let pageStyle = {
            width:'100%',
            height:'100vh',
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
            padding:'20px',
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

        let levelColor = VCC.level.backgroundColor;
        let levelTitleColor = VCC.level.color;
        let levelStyle = {
            backgroundColor:levelColor,
            color:levelTitleColor,
            padding:'10px',
            margin:'10px',
            borderRadius:'4px',
            border:'1px solid rgba(0,0,0,.15)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            fontSize:'1.25em'
        };
        let levelCallback = (index) => {
            localStorage.setItem('currentLevel',index);
            window.setAppView('game');
        };

        return(
            <div style={pageStyle}>
                <div style={bannerStyle}>
                    {BackButton}
                    <h1 style={titleStyle}>{title}</h1>
                    <div />
                </div>
                <div style={{width:'100%',display:'flex',flexDirection:'column',marginTop:'80px'}}>
                    {this.props.levels.map((level,index) => {
                        let name = level.title == "" || level.title == undefined ? `Level ${index+1}` : level.title;
                        return(
                            <HoverButton styling={levelStyle} content={name} callback={() => {levelCallback(index)}}/>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default LevelPage;