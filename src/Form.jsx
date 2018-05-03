import React from "react";
import PropTypes from "prop-types";
import { FormContext } from "./Form/Context";

export { InputGroup } from "./Form/InputGroup";

export class Form extends React.Component {

  constructor( props ) {
    super( props );
    this.form = React.createRef();
    this.onSubmit = this.onSubmit.bind( this );

    this.registerInputGroup = ( instance ) => {
      this.setState( state => {
        return {
          inputGroups: [ ...state.inputGroups, instance ]
        };
      });
    };

    this.setError = ( message ) => {
      this.setState({ error: message });
    };

    this.state = {
      valid: true,
      error: null,
      inputGroups: [],
      registerInputGroup: this.registerInputGroup,
      setError: this.setError
    };
  }



  /**
   * Abstract method to be overriden by a concrete implementation
   */
  onSubmit( e ) {
    const { onSubmit } = this.props;
    e.preventDefault();
    this.setState({ valid: this.checkValidity() });
    onSubmit && onSubmit.call( this, this );
  }

  /**
   * Scroll the first errored input group into view
   */
  scrollIntoViewFirstInvalidInputGroup() {
    const firstInvalid = this.state.inputGroups.find( group => !group.valid );
    if ( firstInvalid && "scrollIntoView" in firstInvalid ) {
      firstInvalid.scrollIntoView();
    }
  }



  checkValidity() {
    const valid = this.state.inputGroups.reduce( ( isValid, group ) => {
      return group.checkValidityAndUpdate() && isValid;
    }, true );
    valid || this.scrollIntoViewFirstInvalidInputGroup();
    return valid;
  }

  static normalizeTagProps( props ) {
    const whitelisted = { ...props };
    if ( "onSubmit" in whitelisted ) {
      delete whitelisted[ "onSubmit" ];
    }
    return whitelisted;
  }

  render() {
    const { inputs, children } = this.props,
      { error, valid } = this.state,
      form = this,
      tagProps = Form.normalizeTagProps( this.props );

    return (
      <FormContext.Provider value={this.state}>
          <form noValidate ref={this.form} {...tagProps} onSubmit={this.onSubmit}>
            { children( { error, valid, form } ) }
          </form>
      </FormContext.Provider>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  tabindex: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  action: PropTypes.string,
  autoComplete: PropTypes.string,
  encType: PropTypes.string,
  method: PropTypes.string,
  name: PropTypes.string,
  target: PropTypes.string
};