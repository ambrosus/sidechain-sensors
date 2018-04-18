import { React, Component } from 'react';

class NoMatch extends Component {
  render() {
    return (
        <div>
            <h3>
                No match for <code>{window.location.pathname}</code>
            </h3>
        </div>
    );
  }
}

export default NoMatch;
