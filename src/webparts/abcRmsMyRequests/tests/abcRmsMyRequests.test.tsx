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
	const descTxt = '';
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

	it('<AbcRmsMyRequests /> should render 3 list items (triggering setState from the test)', () => {
		const mockRequests: Request[] = [
			{
				title: 'T1',
				requestType: 'R1',
				description: 'D1',
				dateOfRequest: '01/14/19',
				department: 'Dep1',
				status: 'Not Started',
				link: 'Http://'
			},
			{
				title: 'T2',
				requestType: 'R2',
				description: 'D2',
				dateOfRequest: '02/14/19',
				department: 'Dep2',
				status: 'Rejected',
				link: 'Http://'
			},
			{
				title: 'T3',
				requestType: 'R3',
				description: 'D3',
				dateOfRequest: '03/14/19',
				department: 'Dep3',
				status: 'Approved',
				link: 'Http://'
			}
		];
		renderedElement.setState({
			myRequests: mockRequests
		});

		expect(renderedElement.update().state('results')).to.not.be.null;
		expect(renderedElement.update().find('ul li').length).to.be.equal(3);
	});
});
