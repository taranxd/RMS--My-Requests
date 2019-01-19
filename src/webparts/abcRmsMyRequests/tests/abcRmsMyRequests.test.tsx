/// <reference types="mocha" />
/// <reference types="sinon" />

import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-15';
import { assert, expect } from 'chai';
import { configure, mount } from 'enzyme';
import AbcRmsMyRequests from '../components/AbcRmsMyRequests';
import { IState, Request } from '../components/IAbcRmsMyRequestsProps';
import { IAbcRmsMyRequestsWebPartProps } from '../AbcRmsMyRequestsWebPart';

configure({ adapter: new Adapter() });

declare const sinon;

describe('<AbcRmsMyRequests />', () => {
	const descTxt = 'TestingThisOneOut';
	let componentDidMountSpy;
	let renderedElement;

	before(() => {
		componentDidMountSpy = sinon.spy(AbcRmsMyRequests.prototype, 'componentDidMount');
		renderedElement = mount(<AbcRmsMyRequests description={descTxt} />);
	});

	after(() => {
		componentDidMountSpy.restore();
	});

	// Test for checking if it is working
	it('Should do something', () => {
		assert.ok(true);
	});

	it('<AbcRmsMyRequests /> should render something', () => {
		expect(renderedElement.find('p')).to.be.exist;
	});

	it('<AbcRmsMyRequests /> should render the description', () => {
		expect(renderedElement.find('p.description').text()).to.be.equals(descTxt);
	});

	it('<AbcRmsMyRequests /> should render an ul', () => {
		expect(renderedElement.find('ul')).to.be.exist;
	});

	it('<AbcRmsMyRequests /> state results should be null', () => {
		expect(renderedElement.state('results')).to.be.null;
	});

	it('<AbcRmsMyRequests /> should call componentDidMount only once', () => {
		// Check if the componentDidMount is called once
		expect(componentDidMountSpy.calledOnce).to.equal(true);
	});

	it('<AbcRmsMyRequests /> should render an ul with 3 items (using the mock data)', (done) => {
		// New instance should be created for this test due to setTimeout
		// If the global renderedElement used, the result of "ul li"" will be 10 instead of 3
		// because the state changes to 10 in the last test and
		// the last test is executed before this one bacause of setTimeout
		let renderedElement1 = mount(<AbcRmsMyRequests description={descTxt} />);
		// Wait for 1 second to check if your mock results are retrieved
		setTimeout(() => {
			// Trigger state update
			renderedElement1.update();
			expect(renderedElement1.state('results')).to.not.be.null;
			expect(renderedElement1.find('ul li').length).to.be.equal(3);
			done(); // done is required by mocha, otherwise the test will yield SUCCESS no matter of the expect cases
		}, 1000);
	});

	it('<AbcRmsMyRequests /> should render 10 list items (triggering setState from the test)', () => {
		renderedElement.setState({
			results: {
				value: [
					{ Title: 'Mock List 1', Id: '1' },
					{ Title: 'Mock List 2', Id: '2' },
					{ Title: 'Mock List 3', Id: '3' },
					{ Title: 'Mock List 4', Id: '4' },
					{ Title: 'Mock List 5', Id: '5' },
					{ Title: 'Mock List 6', Id: '6' },
					{ Title: 'Mock List 7', Id: '7' },
					{ Title: 'Mock List 8', Id: '8' },
					{ Title: 'Mock List 9', Id: '9' },
					{ Title: 'Mock List 10', Id: '10' }
				]
			}
		});

		expect(renderedElement.update().state('results')).to.not.be.null;
		expect(renderedElement.update().find('ul li').length).to.be.equal(10);
	});
});
