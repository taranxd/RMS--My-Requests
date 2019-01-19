import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-webpart-base';

import * as strings from 'AbcRmsMyRequestsWebPartStrings';
import AbcRmsMyRequests from './components/AbcRmsMyRequests';
import { IAbcRmsMyRequestsProps } from './components/IAbcRmsMyRequestsProps';
import pnp from '@pnp/pnpjs';
import { setup as pnpSetup } from '@pnp/common';
const LOG_SOURCE: string = 'My Requests Webpart';
export interface IAbcRmsMyRequestsWebPartProps {
	description: string;
}

export default class AbcRmsMyRequestsWebPart extends BaseClientSideWebPart<IAbcRmsMyRequestsWebPartProps> {
	public onInit(): Promise<void> {
		return super.onInit().then((_) => {
			// other init code may be present
			pnpSetup({
				spfxContext: this.context
			});
		});
	}

	public render(): void {
		const element: React.ReactElement<IAbcRmsMyRequestsProps> = React.createElement(AbcRmsMyRequests, {
			description: this.properties.description
		});

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel
								})
							]
						}
					]
				}
			]
		};
	}
}
