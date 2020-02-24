import { h, Component } from 'preact';
import md5 from 'md5';

import HoverButton from './ReactButtons.js';

class SubmitForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:"",
			name:"",
			optIn:false,
			isSubmitting:false,
			submitted:false
		};
	}

	handleSubmit = (e) => {
        if(this.state.submitted) {
            return;
        }
        e.preventDefault();
        this.setState({ isSubmitting: true });
        console.log(this.state);
        const body = {
            name: this.state.name,
            score: this.props.score,
            privateAttributes: {
                email: this.state.email,
                optIn: this.state.optIn,
            },
        };
        const hash = md5(JSON.stringify(body));

        fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': hash,
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((jsonResponse) => {
                //window.setAppView("leaderboard");
                this.setState({submitted:true, isSubmitting:false});
            })
            .catch(err => {
                this.setState({submitted:true, isSubmitting:false});
                console.log(err);
            });
    }

	render() {
		let VCC = Koji.config.endScreen.scoreForm;
		let formStyle = {
			width:'calc(60% - 20px)',
			backgroundColor:'rgb(240,240,240)',
			padding:'10px',
            border:'1px solid rgba(0,0,0,.5)',
            borderRadius:'4px',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center'
		};

        let coingImage = Koji.config.gameScene.coin;
        let coinStyle = {
            height:'30px',
            width:'auto',
            margin:'0 0 0 10px'
        };

		let buttonVCC = Koji.config.endScreen.leaderboardButton;
		let buttonStyle = {
			fontSize:'1em',
            width:'calc(80% - 20px)',
            padding:'10px',
            border:'1px solid rgba(0,0,0,.15)',
            borderRadius:'4px',
            margin:'10px 0 10px 0',
            backgroundColor:buttonVCC.backgroundColor,
            color:buttonVCC.color
		};
		let submittedForm = <HoverButton styling={buttonStyle} content={buttonVCC.content} callback={() => window.setAppView('leaderboard')}/>;

		const labelStyle = {display:'block',marginBottom:'10px', fontWeight:'bold',color:'rgb(60,60,60)'};
		const inputStyle = {display:'block',width:'calc(100% - 20px)',padding:'10px',border:0,boxShadow:'0 0 0 1px rgba(0,0,0,.2)',borderRadius:'2px'};
		const submitButtonStyle = {float:'right',padding:'10px 20px 10px 20px',backgroundColor:VCC.submitButton.backgroundColor,border:0,borderRadius:'5px',
			color:'rgb(240,240,240)',fontSize:'1em', minWidth:'25%'};
		const wrapperStyle = {width:'100%', margin:'20px 0 0 0'};
        const ruleStyle = {border:'.5px solid rgba(0,0,0,.1)',margin:'20px 0 20px 0', width:'100%'};
        const checkboxStyle = {display:'none'};		
        let submittingStyle = {...submitButtonStyle, backgroundColor:'rgb(200,200,200)', border:'1px solid rgba(0,0,0,.2)', textAlign:'center'};
        let formEnd = this.state.isSubmitting ? <div style={submittingStyle}>{VCC.submitButton.activeContent}</div> : <button type="submit" style={submitButtonStyle}>{VCC.submitButton.defaultContent}</button>;
		let scoreForm = (
			<form onSubmit={(e) => this.handleSubmit(e)} style={formStyle}>
                <div style={{display:'flex',alignItems:'center'}}>
				    <h2>{this.props.score}</h2>
                    <img src={coingImage} style={coinStyle} />
                </div>
				<div style={wrapperStyle}>
					<label for="name" style={labelStyle}>{VCC.nameField}</label>
					<input type="text" id="name" style={inputStyle} required pattern=".*\S+.*" onChange={(e) => {this.setState({name:e.target.value});}} />
				</div> 
				<div style={wrapperStyle}>
					<label for="email" style={labelStyle}>{VCC.emailField}</label>
					<input type="email" id="email" style={inputStyle} onChange={(e) => {this.setState({email:e.target.value});}}/>
				</div>
				<div style={{...wrapperStyle, display:'flex', justifyContent:'left', alignItems:'center'}}>
                    <label style={{...labelStyle, margin:0}}>
                        <input type="checkbox"  style={{margin:'0 5px 0 0'}} checked={this.state.optIn} onClick={(e) => {this.setState({optIn:!this.state.optIn})}}/>
                        {VCC.optIn}
                    </label>
				</div>
                <hr style={ruleStyle}/>
				<div style={wrapperStyle}>
                    {formEnd}
				</div>
			</form>
		);
		return(
			this.state.submitted ? submittedForm : scoreForm
		);
	}
}

export default SubmitForm;