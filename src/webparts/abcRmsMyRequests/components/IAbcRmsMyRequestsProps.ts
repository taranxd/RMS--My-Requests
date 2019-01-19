export interface IAbcRmsMyRequestsProps {
	description: string;
}
export interface IState {
	currentUser: any;
	requestLists: any[];
	myRequests: Request[];
	// UserRequests: {
	// 	requestType: '';
	// 	reason: '';
	// 	dateOfRequest: '';
	// 	requestStatus: '';
	// 	comments: '';
	// 	link: '';
	// }[];
}
export interface Request {
	title: string;
	requestType: string;
	description: string;
	dateOfRequest: string;
	department: string;
	status: string;
	link: string;
}
