export default {
	name: 'Teenagers Virtual Locker',
	root: {
		folder_type: 'simple',
		path: '/Virtual lockers/',
	},
	sub_folders: [
		{
			name: 'Legal Documentation',
			sub_folders: [
				{
					name: 'USCIS-related files',
					sub_folders: [
						{
							name: 'Applications',
						},
						{
							name: 'Copies of official docs',
						},
						{
							name: 'Case status receipt notices',
						},
					],
				},
				{
					name: 'Post released documentation',
					sub_folders: [
						{
							name: 'School/class records',
						},
						{
							name: 'NTA/entry docs',
						},
						{
							name: 'Medical info',
						},
					],
				},
				{
					name: 'Personal documents',
					sub_folders: [
						{
							name: 'Copies of birth Certificate',
						},
						{
							name: 'Copies of passport',
						},
						{
							name: 'Copies of consulate IDs',
						},
					],
				},
			],
		},

		{
			name: 'Social Services Documentation',
			sub_folders: [
				{
					name: 'Case Management records',
					sub_folders: [
						{
							name: 'Intake form',
						},
						{
							name: 'Case plans',
						},
						{
							name: 'Consent form',
						},
					],
				},
				{
					name: 'Enrollment/verification forms',
					sub_folders: [
						{
							name: 'School enrollment',
						},
						{
							name: 'Medical/health insurance enrollment',
						},
						{
							name: 'Proof of address',
						},
						{
							name: 'Copy of ITIN number',
						},
					],
				},
				{
					name: 'List of important contacts',
					sub_folders: [
						{
							name: 'Case managers/workers',
						},
						{
							name: 'School counselors',
						},
						{
							name: 'Psychologist',
						},
						{
							name: 'Shelters',
						},
						{
							name: 'Hotlines',
						},
					],
				},
			],
		},

		{
			name: 'Personal folder',
			sub_folders: [
				{
					name: 'Benefit letters',
				},
				{
					name: 'Diplomas/certifications',
				},
				{
					name: 'Pictures',
				},
				{
					name: 'Personal IDs',
					sub_folders: [
						{
							name: 'School ID',
						},
						{
							name: 'Birth certificate',
						},
						{
							name: 'Consulate ID',
						},
						{
							name: 'Drivers license',
						},
						{
							name: 'Work permit',
						},
					],
				},
			],
		},
	],
};
