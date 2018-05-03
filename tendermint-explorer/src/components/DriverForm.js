import React, { Component } from 'react'
import { Form, FormGroup, Input, Label, Button } from 'reactstrap'

import Rules from './Rules'

// Component

class DriverForm extends Component {

    // State

    state = {
        seed: "",
        isValidSeed: undefined,
        rules: "",
        isValidRules: undefined
    }

    // Private

    validateSeed = (value) => {
        if (value === undefined) return undefined
        
        const length = value.length
        
        if (length === 0) return undefined
        if (length > 0 && length < 16) return false
        else return true
    }

    validateRules = (value) => {
        if (value === undefined) return undefined
        
        const length = value.length
        
        if (length === 0) return undefined
        if (length > 0 && length < 8) return false
        else return true
    }

    onSeedChange = (e) => {
        const seed = e.target.value
        const isValidSeed = this.validateSeed(seed)

        this.setState({ seed, isValidSeed })
    }

    onRulesChange = (e) => {
        const rules = e.target.value
        const isValidRules = this.validateRules(rules)
        console.log(rules);
        
        this.setState({ rules, isValidRules })
    }

    onSubmit = (e) => {
        e.preventDefault();

        this.props.onStartTrip(this.state.seed, this.state.rules)
    }

    // Render

    render() {
        const isValidInputs = this.state.isValidSeed && this.state.isValidRules

        return (
            <div className="driver-form">
                <Form>
                    <FormGroup>
                        <Label for="seed">Seed</Label>
                        <Input
                            id="seed"
                            name="seed"
                            placeholder="Ex.: asfJh9w2efJoijdf0asd9IJoifasd09fjwasdfaidf0wfahwdfh9"
                            value={ this.state.seed }
                            invalid={ this.state.isValidSeed === undefined ? false : !this.state.isValidSeed }
                            valid={ this.state.isValidSeed }
                            onChange={ this.onSeedChange }
                        />
                    </FormGroup>

                    <FormGroup>
                    <Label for="rules">Set of rules</Label>
                        <Input
                            id="rules"
                            name="rules"
                            placeholder="Ex.: 10203040"
                            value={ this.state.rules }
                            invalid={ this.state.isValidRules === undefined ? false : !this.state.isValidRules }
                            valid={ this.state.isValidRules }
                            onChange={ this.onRulesChange }
                        />
                    </FormGroup>

                    <Rules rules={ this.state.rules }/>

                    <Button block 
                        color={ isValidInputs ? "success" : "secondary" }
                        disabled={ !isValidInputs } 
                        onClick={ this.onSubmit }>
                        Start trip!
                    </Button>
                </Form>
            </div>
        )
    }
}

export default DriverForm;