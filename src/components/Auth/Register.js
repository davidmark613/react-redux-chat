import React, {Component} from 'react';
import firebase from '../../firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import md5 from 'md5';
import {Grid, Form, Segment, Button, Message, Icon, Header} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = {message: 'Fill in all fields'};
            this.setState({errors: errors.concat(error)});
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = {message: 'Password is invalid'};
            this.setState({errors: errors.concat(error)});
            return false;
        } else {
            return true;
        }
    }

    isFormEmpty = () => {
        const {username, email, password, confirmPassword} = this.state;
        return !username.length || !email.length || !password.length || !confirmPassword.length;
    }

    isPasswordValid = () => {
        const {password, confirmPassword} = this.state;
        if (password.length < 6 || confirmPassword.length < 6) {
            return false;
        } else if (password !== confirmPassword) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, index) => <p key={index}>{error.message}</p>);

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value})
    };

    handleSubmit = event => {
        event.preventDefault();
        const {username, email, password} = this.state;
        if (this.isFormValid()) {
            this.setState({errors: [], loading: true});
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: username,
                        photoURL: `http://gravatar.com/avatar/${md5(
                            createdUser.user.email)}?d=identicon`
                    })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                console.log('user saved')
                            })
                        })
                        .catch(error => {
                            console.error(error);
                            this.setState({
                                errors: this.state.errors.concat(error),
                                loading: false
                            });
                        });
                })
                .catch(error => {
                    console.error(error);
                    this.setState({
                        errors: this.state.errors.concat(error),
                        loading: false
                    });
                })
                .finally(() => {
                    this.setState({loading: false})
                })
        }
    };

    saveUser = createdUser => {
        return this.state.userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    handleInputError = (errors, field) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(field)
        )
            ? 'error'
            : ''
    }

    render() {
        const {handleChange, handleSubmit, displayErrors, handleInputError} = this;
        const {username, email, password, confirmPassword, errors, loading} = this.state;

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h1' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange'/>
                        Register for DevChat
                    </Header>
                    <Form onSubmit={handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name='username'
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                onChange={handleChange}
                                value={username}
                                className={handleInputError(errors, 'username')}
                                type='text'
                            />

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

                            <Form.Input
                                fluid
                                name='confirmPassword'
                                icon='repeat'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                onChange={handleChange}
                                value={confirmPassword}
                                className={handleInputError(errors, 'confirmPassword')}
                                type='password'
                            />

                            <Button
                                className={loading ? 'loading' : ''}
                                color='orange'
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
                        Already a user ? <Link to='/login'>Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register;