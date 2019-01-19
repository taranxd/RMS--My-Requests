import * as React from 'react';
import styles from './AbcRmsMyRequests.module.scss';
import { IAbcRmsMyRequestsProps, IState, Request } from './IAbcRmsMyRequestsProps';
import { Log } from '@microsoft/sp-core-library';
import 'office-ui-fabric-core/dist/css/fabric.min.css';
import pnp, { objectDefinedNotNull } from '@pnp/pnpjs';
import { sp } from '@pnp/sp';
import { CurrentUser } from '@pnp/sp/src/siteusers';
const LOG_SOURCE: string = 'My Requests Webpart';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { GroupedList, IGroup } from 'office-ui-fabric-react/lib/components/GroupedList/index';

let _items: Request[] = [];

export default class AbcRmsMyRequests extends React.Component<IAbcRmsMyRequestsProps, IState> {
	constructor(props: IAbcRmsMyRequestsProps) {
		super(props);
		this.state = {
			currentUser: '',
			requestLists: [],
			myRequests: []
		};
	}

	public componentDidMount(): void {
		try {
			this.GetCurrentUserRequests();
		} catch (error) {
			Log.error(LOG_SOURCE, error);
		}
	}
	//Get Current User Display Name

	public GetCurrentUserRequests(): void {
		try {
			//Get Current User
			sp.web.currentUser
				.get()
				.then((r: CurrentUser) => {
					this.setState({ currentUser: r });
				})
				.then(() => {
					//Get All Request lists
					sp.web.lists
						.getByTitle('Request Config')
						.items.filter('isActive eq 1')
						.get()
						.then((r) => {
							console.log(r);
							this.setState({ requestLists: r });
							console.log(this.state.currentUser.Id);
						})
						.then(() => {
							//Get Current User Request from all the lists in batch
							const batch = sp.web.createBatch();
							this.state.requestLists.forEach((list) => {
								sp.web.lists
									.getByTitle(list.Title)
									.items.inBatch(batch)
									//.filter("Author eq 'Taran Goel'")
									.filter('Author eq ' + this.state.currentUser.Id)
									.orderBy('Created', false)
									.get()
									.then((requests) => {
										requests.forEach((req) => {
											let employeeDepartment: string;
											let requestType: string;
											let date = new Date(req.DateOfRequest);
											if (
												req.EmployeeDepartment != objectDefinedNotNull &&
												req.EmployeeDepartment.length > 0
											) {
												employeeDepartment = req.EmployeeDepartment[0].Label;
											}
											if (
												req.Request_x0020_Type != objectDefinedNotNull &&
												req.Request_x0020_Type.length > 0
											) {
												requestType = req.Request_x0020_Type[0].Label;
											}
											console.log(req);
											let r: Request = {
												title: req.Title,
												requestType: requestType,
												description: req.RequestDescription,
												dateOfRequest:
													req.Created != objectDefinedNotNull
														? req.Created.split('T')[0]
														: '',
												department: employeeDepartment,
												status: req.RequestStatus,
												link: req.Title
											};

											_items.push(r);
											this.state.myRequests.push(r);
											this.setState(this.state);
										});
									});
							});
							// this line executes actual HTTP request to $batch endpoint
							batch.execute().then((data) => {});
						});
				});
		} catch (e) {
			Log.error(LOG_SOURCE, e);
		}
	}

	public render(): React.ReactElement<IAbcRmsMyRequestsProps> {
		const viewFields: IViewField[] = [
			{
				name: 'title',
				displayName: 'Request Title',
				sorting: true,
				isResizable: true,
				maxWidth: 80
			},
			// {
			// 	name: 'requestType',
			// 	displayName: 'Request Type',
			// 	sorting: true,
			// 	isResizable: true,
			// 	maxWidth: 80
			// },
			{
				name: 'description',
				displayName: 'Request Description',
				sorting: true,
				isResizable: true
				//maxWidth: 80
			},
			{
				name: 'dateOfRequest',
				displayName: 'Date of Request',
				sorting: true,
				isResizable: true
				//maxWidth: 80
			},
			{
				name: 'department',
				displayName: 'Department',
				sorting: true,
				isResizable: true
				//maxWidth: 80
			},
			{
				name: 'status',
				displayName: 'Request Status',
				sorting: true,
				isResizable: true
				//maxWidth: 80
			},
			{
				name: 'link',
				displayName: 'View Request',
				sorting: false,
				isResizable: true,
				//		maxWidth: 100,
				render: (item: any) => {
					if (item['status'] === 'Not Started') {
						return <a href="http://google.com/Edit">Edit</a>;
					} else {
						return <a href="http://google.com/View">View</a>;
					}
				}
			}
		];

		const groupByFields: IGrouping[] = [
			{
				name: 'requestType',
				order: GroupOrder.ascending
			}
		];

		return (
			<ListView
				items={this.state.myRequests}
				viewFields={viewFields}
				compact={true}
				selectionMode={SelectionMode.none}
				groupByFields={groupByFields}
				filterPlaceHolder="Search..."
				showFilter={true}
			/>
		);
	}
}
