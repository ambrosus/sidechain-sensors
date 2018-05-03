import React, { Component } from 'react';
import { Button, Container, InputGroup, Input, InputGroupAddon, Row, Label, FormGroup } from 'reactstrap';
import _ from 'lodash';

import '../App.css';

// Component

class Rules extends Component {

    isEven (n) {
        return n % 2 == 0;
    }

    buildFromRules (rules) {
        if (rules === undefined || rules === "") return
        if (!this.isEven(rules.length)) return
        if (rules.length < 4) return

        let chunks = _.chunk(rules, 2)
        let settingsLength = parseInt(chunks[0].join(''))
        let settings = _.chunk(chunks.slice(1, chunks.length), 3)
        let reduceToComponents = _.bind((settings) => {
            _.reduce(settings, ([result, acc, self], s) => {
                let val = parseInt(s.join(''))

                if (acc == 1) return [result.concat(self.maxTemp(acc, val)), acc + 1, self]
                if (acc == 2) return [result.concat(self.minTemp(acc, val)), acc + 1, self]
                if (acc == 3) return [result.concat(self.time(acc, val)), acc + 1, self]
            }, [[], 1, this])
        }, this)

        return _.map(settings, s => { 
            let result, ev
            [result, ...ev] = reduceToComponents(s)

            return result
        })
    }

    maxTemp (key, value) { 
        return (
            <FormGroup className="form-inline col-md-12" key={ key }>
                <Label for="max" className="col-sm-5"> Max. Temp</Label>
                <Input id="max" placeholder="Max. Temp" disabled="true" defaultValue={ value } className="col-sm-7"/>
            </FormGroup>
        )
    }

    minTemp (key, value) { 
        return (
            <FormGroup className="form-inline col-md-12" key={key}>
                <Label for="min" className="col-sm-5">min. Temp</Label>
                <Input id="min" placeholder="min. Temp" disabled="true" defaultValue={value} className="col-sm-7"/>
            </FormGroup>
        )
    }

    time (key, value) { 
        return (
            <FormGroup className="form-inline col-md-12" key={key}>
                <Label for="time" className="col-sm-5">Time</Label>
                <Input id="time" placeholder="Max. Temp" disabled="true" defaultValue={value} className="col-sm-7"/>
            </FormGroup>
        )
    }

    // Render

    render() {
        return (
            <Row className="col-md-12 pt-3">
                { this.buildFromRules(this.props.rules) }
            </Row>
        )
    }
}

export default Rules
