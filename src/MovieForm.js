import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {FormGroup, FormControl, ControlLabel, Button, Panel, ListGroup, ListGroupItem, Image, Grid, Row, Col} from 'react-bootstrap'

const PanelFooter = (props) => {
	return (
		<Row className="text-right" style={{paddingRight: '10px'}}>
			<Button bsStyle="success" type="submit">
				<i className="glyphicon glyphicon-floppy-save"></i> Save
			</Button>
		</Row>
	);
}

export default class MovieForm extends React.Component {

	state = {
		name: '',
		director: '',
		imageUrl: ''
	}

	componentWillReceiveProps = (nextProps) => {				
		this.setState({
			name : nextProps.selectedMovie ? nextProps.selectedMovie.name : '',
			director : nextProps.selectedMovie ? nextProps.selectedMovie.director : '',
			imageUrl: nextProps.selectedMovie ? nextProps.selectedMovie.imageUrl : ''
		});		
	}

	handleChange = (e) => {
		this.setState({
			name: ReactDOM.findDOMNode(this.refs.name).value,
			director: ReactDOM.findDOMNode(this.refs.director).value,
			imageUrl: ReactDOM.findDOMNode(this.refs.imageUrl).value,
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.getSubmittedData(this.state);
	}

	render = () => {
		const {
			name,
			director,
			imageUrl
		} = this.state;

		let image = null;
		if (imageUrl && imageUrl.length > 0) {
			image = <FormGroup className="text-center">
				<Image src={imageUrl} thumbnail responsive style={{width: '300px', height: '300px'}} />
			</FormGroup>;
		}

		return (
			<Row style={{padding: '20px'}}>
				<form role="form" onSubmit={this.handleSubmit}>
					<Panel bsStyle="info" header={this.props.formTitle} footer = {<PanelFooter />}>								
						<FormGroup>
							<ControlLabel>Name</ControlLabel>
							<FormControl 
								ref="name"
								type="text" 
								value={name} 
								placeholder="Name" 
								onChange={this.handleChange} />
						</FormGroup>
						<FormGroup>
							<ControlLabel>Director</ControlLabel>
							<FormControl 
								ref="director"
								type="text" 
								value={director} 
								placeholder="Director" 
								onChange={this.handleChange} />
						</FormGroup>
						<FormGroup>
							<ControlLabel>Image URL</ControlLabel>
							<FormControl 
								ref="imageUrl"
								type="text"
								value={imageUrl} 
								placeholder="Image URL" 
								onChange={this.handleChange} />							
						</FormGroup>
						{image}					
					</Panel>
				</form>
			</Row>
		);
	}
}

// Must be like this, not as internal static variable
MovieForm.propTypes = {
		getSubmittedData: PropTypes.func.isRequired,
		movies: PropTypes.array.isRequired,
		formTitle: PropTypes.string.isRequired
	}