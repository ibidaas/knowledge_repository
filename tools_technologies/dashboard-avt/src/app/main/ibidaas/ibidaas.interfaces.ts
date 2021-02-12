export interface Project {
	Id: number;
	Name: string;
	ProcessingType: number;
	Status: boolean;
	Created: string;
}

export interface ProjectiBiDaas{
	id: number;
	name: string;
	created_at: string;
	status: string
	updated_at: string;
}

export interface TDFModel {
	value: string;
	viewValue: string;
}

export interface External {
	value: string;
	viewValue: string;
}

export interface AnalyticsAlgorithm {
	value: string;
	viewValue: string;
}