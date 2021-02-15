import React from 'react';
import {Progress} from 'semantic-ui-react';

const ProgressBar = ({uploadState, percentUploaded}) => (
    uploadState && (
        <Progress
            className='progressBar'
            percent={percentUploaded}
            progress
            indicating
            size='medium'
            inverted
        />
    )
);

export default ProgressBar;