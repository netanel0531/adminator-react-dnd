import '../styles/index.scss';

import './masonry';
import './charts';
import './popover';
import './scrollbar';
import './search';
import './sidebar';
import './skycons';
import './vectorMaps';
import './chat';
import './datatable';
import './datepicker';
import './email';
import './fullcalendar';
import './googleMaps';
import './utils';

import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './charts/chartJS/index'

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

