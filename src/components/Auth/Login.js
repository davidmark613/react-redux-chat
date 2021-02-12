import React, {Component} from 'react';
import firebase from '../../firebase';
import {Grid, Form, Segment, Button, Message, Icon, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Login extends Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    displayErrors = errors => errors.map((error, index) => <p key={index}>{error.message}</p>);

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    };

    handleSubmit = event => {
        const {email, password} = this.state;
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({errors: [], loading: true});
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedUser => {
                    console.log(signedUser)
                })
                .catch(error => {
                    console.error(error);
                    this.setState({errors: this.state.errors.concat(error)});
                })
                .finally(() => {
                    this.setState({loading: false})
                });
        }
    };

    isFormValid = ({email, password}) => email && password;

    handleInputError = (errors, field) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(field)
        )
            ? 'error'
            : ''
    }

    render() {
        const {handleChange, handleSubmit, displayErrors, handleInputError} = this;
        const {email, password, errors, loading} = this.state;

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h1' icon color='violet' textAlign='center'>
                        <Icon name='code branch' color='violet'/>
                        Login to DevChat
                    </Header>
                    <Form onSubmit={handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name='email'
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email Address'
                                onChange={handleChange}
                                value={email}
                                className={handleInputError(errors, 'email')}
                                type='email'
                            />

                            <Form.Input
                                fluid
                                name='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                onChange={handleChange}
                                value={password}
                                className={handleInputError(errors, 'password')}
                                type='password'
                            />

                            <Button
                                className={loading ? 'loading' : ''}
                                color='violet'
                                fluid size='large'
                                disabled={loading}
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Don't have an account ? <Link to='/register'>Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login;