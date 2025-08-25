

CREATE TABLE public."ActionClass" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	"type" public."ActionType" NOT NULL,
	"noCodeConfig" jsonb NULL,
	"environmentId" text NOT NULL,
	"key" text NULL,
	CONSTRAINT "ActionClass_pkey" PRIMARY KEY (id),
	CONSTRAINT "ActionClass_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ActionClass_environmentId_created_at_idx" ON public."ActionClass" USING btree ("environmentId", created_at);
CREATE UNIQUE INDEX "ActionClass_key_environmentId_key" ON public."ActionClass" USING btree (key, "environmentId");
CREATE UNIQUE INDEX "ActionClass_name_environmentId_key" ON public."ActionClass" USING btree (name, "environmentId");


-- public."ApiKey" definition

-- Drop table

-- DROP TABLE public."ApiKey";

CREATE TABLE public."ApiKey" (
	id text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NULL,
	"lastUsedAt" timestamp(3) NULL,
	"label" text NOT NULL,
	"hashedKey" text NOT NULL,
	"organizationId" text NOT NULL,
	"organizationAccess" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "ApiKey_pkey" PRIMARY KEY (id),
	CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ApiKey_hashedKey_key" ON public."ApiKey" USING btree ("hashedKey");
CREATE INDEX "ApiKey_organizationId_idx" ON public."ApiKey" USING btree ("organizationId");


-- public."ApiKeyEnvironment" definition

-- Drop table

-- DROP TABLE public."ApiKeyEnvironment";

CREATE TABLE public."ApiKeyEnvironment" (
	id text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"apiKeyId" text NOT NULL,
	"environmentId" text NOT NULL,
	"permission" public."ApiKeyPermission" NOT NULL,
	CONSTRAINT "ApiKeyEnvironment_pkey" PRIMARY KEY (id),
	CONSTRAINT "ApiKeyEnvironment_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES public."ApiKey"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "ApiKeyEnvironment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ApiKeyEnvironment_apiKeyId_environmentId_key" ON public."ApiKeyEnvironment" USING btree ("apiKeyId", "environmentId");
CREATE INDEX "ApiKeyEnvironment_environmentId_idx" ON public."ApiKeyEnvironment" USING btree ("environmentId");


-- public."Contact" definition

-- Drop table

-- DROP TABLE public."Contact";

CREATE TABLE public."Contact" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"environmentId" text NOT NULL,
	"userId" text NULL,
	CONSTRAINT "Contact_pkey" PRIMARY KEY (id),
	CONSTRAINT "Contact_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Contact_environmentId_idx" ON public."Contact" USING btree ("environmentId");


-- public."ContactAttributeKey" definition

-- Drop table

-- DROP TABLE public."ContactAttributeKey";

CREATE TABLE public."ContactAttributeKey" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"name" text NULL,
	description text NULL,
	"environmentId" text NOT NULL,
	"type" public."ContactAttributeType" DEFAULT 'custom'::"ContactAttributeType" NOT NULL,
	"key" text NOT NULL,
	"isUnique" bool DEFAULT false NOT NULL,
	CONSTRAINT "ContactAttributeKey_pkey" PRIMARY KEY (id),
	CONSTRAINT "ContactAttributeKey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ContactAttributeKey_environmentId_created_at_idx" ON public."ContactAttributeKey" USING btree ("environmentId", created_at);
CREATE UNIQUE INDEX "ContactAttributeKey_key_environmentId_key" ON public."ContactAttributeKey" USING btree (key, "environmentId");


-- public."Insight" definition

-- Drop table

-- DROP TABLE public."Insight";

CREATE TABLE public."Insight" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"environmentId" text NOT NULL,
	category public."InsightCategory" NOT NULL,
	title text NOT NULL,
	description text NOT NULL,
	vector public.vector NULL,
	CONSTRAINT "Insight_pkey" PRIMARY KEY (id),
	CONSTRAINT "Insight_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."Integration" definition

-- Drop table

-- DROP TABLE public."Integration";

CREATE TABLE public."Integration" (
	id text NOT NULL,
	"type" public."IntegrationType" NOT NULL,
	"environmentId" text NOT NULL,
	config jsonb NOT NULL,
	CONSTRAINT "Integration_pkey" PRIMARY KEY (id),
	CONSTRAINT "Integration_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Integration_environmentId_idx" ON public."Integration" USING btree ("environmentId");
CREATE UNIQUE INDEX "Integration_type_environmentId_key" ON public."Integration" USING btree (type, "environmentId");


-- public."Invite" definition

-- Drop table

-- DROP TABLE public."Invite";

CREATE TABLE public."Invite" (
	id text NOT NULL,
	email text NOT NULL,
	"name" text NULL,
	"organizationId" text NOT NULL,
	"creatorId" text NOT NULL,
	"acceptorId" text NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"deprecatedRole" public."MembershipRole" NULL,
	"role" public."OrganizationRole" DEFAULT 'member'::"OrganizationRole" NOT NULL,
	"teamIds" _text DEFAULT ARRAY[]::text[] NULL,
	CONSTRAINT "Invite_pkey" PRIMARY KEY (id),
	CONSTRAINT "Invite_acceptorId_fkey" FOREIGN KEY ("acceptorId") REFERENCES public."User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Invite_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "Invite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Invite_email_organizationId_idx" ON public."Invite" USING btree (email, "organizationId");
CREATE INDEX "Invite_organizationId_idx" ON public."Invite" USING btree ("organizationId");


-- public."Membership" definition

-- Drop table

-- DROP TABLE public."Membership";

CREATE TABLE public."Membership" (
	"organizationId" text NOT NULL,
	"userId" text NOT NULL,
	accepted bool DEFAULT false NOT NULL,
	"deprecatedRole" public."MembershipRole" NULL,
	"role" public."OrganizationRole" DEFAULT 'member'::"OrganizationRole" NOT NULL,
	CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId", "organizationId"),
	CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Membership_organizationId_idx" ON public."Membership" USING btree ("organizationId");
CREATE INDEX "Membership_userId_idx" ON public."Membership" USING btree ("userId");


-- public."Project" definition

-- Drop table

-- DROP TABLE public."Project";

CREATE TABLE public."Project" (
	id text DEFAULT gen_random_uuid() NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"organizationId" text NOT NULL,
	"brandColor" text NULL,
	"highlightBorderColor" text NULL,
	styling jsonb DEFAULT '{"allowStyleOverwrite": true}'::jsonb NOT NULL,
	config jsonb DEFAULT '{}'::jsonb NOT NULL,
	"recontactDays" int4 DEFAULT 7 NOT NULL,
	"linkSurveyBranding" bool DEFAULT true NOT NULL,
	"inAppSurveyBranding" bool DEFAULT true NOT NULL,
	placement text DEFAULT 'bottomRight'::text NOT NULL,
	"clickOutsideClose" bool DEFAULT true NOT NULL,
	"darkOverlay" bool DEFAULT false NOT NULL,
	logo jsonb NULL,
	CONSTRAINT "Project_organizationId_name_key" UNIQUE ("organizationId", name),
	CONSTRAINT "Project_pkey" PRIMARY KEY (id),
	CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON DELETE CASCADE
);
CREATE INDEX "Project_organizationId_idx" ON public."Project" USING btree ("organizationId");


-- public."Segment" definition

-- Drop table

-- DROP TABLE public."Segment";

CREATE TABLE public."Segment" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	title text NOT NULL,
	description text NULL,
	"isPrivate" bool DEFAULT true NOT NULL,
	filters jsonb DEFAULT '[]'::jsonb NOT NULL,
	"environmentId" text NOT NULL,
	CONSTRAINT "Segment_pkey" PRIMARY KEY (id),
	CONSTRAINT "Segment_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Segment_environmentId_idx" ON public."Segment" USING btree ("environmentId");
CREATE UNIQUE INDEX "Segment_environmentId_title_key" ON public."Segment" USING btree ("environmentId", title);


-- public."Survey" definition

-- Drop table

-- DROP TABLE public."Survey";

CREATE TABLE public."Survey" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"environmentId" text NOT NULL,
	status public."SurveyStatus" DEFAULT 'draft'::"SurveyStatus" NOT NULL,
	questions jsonb DEFAULT '[]'::jsonb NOT NULL,
	"displayOption" public."displayOptions" DEFAULT 'displayOnce'::"displayOptions" NOT NULL,
	"recontactDays" int4 NULL,
	"thankYouCard" jsonb NULL,
	"type" public."SurveyType" DEFAULT 'web'::"SurveyType" NOT NULL,
	"autoClose" int4 NULL,
	delay int4 DEFAULT 0 NOT NULL,
	"autoComplete" int4 NULL,
	"redirectUrl" text NULL,
	"closeOnDate" timestamp(3) NULL,
	"surveyClosedMessage" jsonb NULL,
	"verifyEmail" jsonb NULL,
	"singleUse" jsonb DEFAULT '{"enabled": false, "isEncrypted": true}'::jsonb NULL,
	"projectOverwrites" jsonb NULL,
	"hiddenFields" jsonb DEFAULT '{"enabled": false}'::jsonb NOT NULL,
	pin text NULL,
	"welcomeCard" jsonb DEFAULT '{"enabled": false}'::jsonb NOT NULL,
	styling jsonb NULL,
	"resultShareKey" text NULL,
	"displayPercentage" numeric(65, 30) NULL,
	"createdBy" text NULL,
	"segmentId" text NULL,
	"inlineTriggers" jsonb NULL,
	"runOnDate" timestamp(3) NULL,
	"displayLimit" int4 NULL,
	"showLanguageSwitch" bool NULL,
	"isVerifyEmailEnabled" bool DEFAULT false NOT NULL,
	endings _jsonb DEFAULT ARRAY[]::jsonb[] NULL,
	variables jsonb DEFAULT '[]'::jsonb NOT NULL,
	"isSingleResponsePerEmailEnabled" bool DEFAULT false NOT NULL,
	"isBackButtonHidden" bool DEFAULT false NOT NULL,
	recaptcha jsonb DEFAULT '{"enabled": false, "threshold": 0.1}'::jsonb NULL,
	CONSTRAINT "Survey_pkey" PRIMARY KEY (id),
	CONSTRAINT "Survey_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "Survey_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Survey_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES public."Segment"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "Survey_environmentId_updated_at_idx" ON public."Survey" USING btree ("environmentId", updated_at);
CREATE UNIQUE INDEX "Survey_resultShareKey_key" ON public."Survey" USING btree ("resultShareKey");
CREATE INDEX "Survey_segmentId_idx" ON public."Survey" USING btree ("segmentId");


-- public."SurveyAttributeFilter" definition

-- Drop table

-- DROP TABLE public."SurveyAttributeFilter";

CREATE TABLE public."SurveyAttributeFilter" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"attributeKeyId" text NOT NULL,
	"surveyId" text NOT NULL,
	"condition" public."SurveyAttributeFilterCondition" NOT NULL,
	value text NOT NULL,
	CONSTRAINT "SurveyAttributeFilter_pkey" PRIMARY KEY (id),
	CONSTRAINT "SurveyAttributeFilter_attributeKeyId_fkey" FOREIGN KEY ("attributeKeyId") REFERENCES public."ContactAttributeKey"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "SurveyAttributeFilter_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "SurveyAttributeFilter_attributeKeyId_idx" ON public."SurveyAttributeFilter" USING btree ("attributeKeyId");
CREATE UNIQUE INDEX "SurveyAttributeFilter_surveyId_attributeKeyId_key" ON public."SurveyAttributeFilter" USING btree ("surveyId", "attributeKeyId");
CREATE INDEX "SurveyAttributeFilter_surveyId_idx" ON public."SurveyAttributeFilter" USING btree ("surveyId");


-- public."SurveyFollowUp" definition

-- Drop table

-- DROP TABLE public."SurveyFollowUp";

CREATE TABLE public."SurveyFollowUp" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"surveyId" text NOT NULL,
	"name" text NOT NULL,
	"trigger" jsonb NOT NULL,
	"action" jsonb NOT NULL,
	CONSTRAINT "SurveyFollowUp_pkey" PRIMARY KEY (id),
	CONSTRAINT "SurveyFollowUp_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."SurveyLanguage" definition

-- Drop table

-- DROP TABLE public."SurveyLanguage";

CREATE TABLE public."SurveyLanguage" (
	"languageId" text NOT NULL,
	"surveyId" text NOT NULL,
	"default" bool DEFAULT false NOT NULL,
	enabled bool DEFAULT true NOT NULL,
	CONSTRAINT "SurveyLanguage_pkey" PRIMARY KEY ("languageId", "surveyId"),
	CONSTRAINT "SurveyLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public."Language"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "SurveyLanguage_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "SurveyLanguage_languageId_idx" ON public."SurveyLanguage" USING btree ("languageId");
CREATE INDEX "SurveyLanguage_surveyId_idx" ON public."SurveyLanguage" USING btree ("surveyId");


-- public."SurveyTrigger" definition

-- Drop table

-- DROP TABLE public."SurveyTrigger";

CREATE TABLE public."SurveyTrigger" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"surveyId" text NOT NULL,
	"actionClassId" text NOT NULL,
	CONSTRAINT "SurveyTrigger_pkey" PRIMARY KEY (id),
	CONSTRAINT "SurveyTrigger_actionClassId_fkey" FOREIGN KEY ("actionClassId") REFERENCES public."ActionClass"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "SurveyTrigger_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "SurveyTrigger_surveyId_actionClassId_key" ON public."SurveyTrigger" USING btree ("surveyId", "actionClassId");
CREATE INDEX "SurveyTrigger_surveyId_idx" ON public."SurveyTrigger" USING btree ("surveyId");


-- public."Tag" definition

-- Drop table

-- DROP TABLE public."Tag";

CREATE TABLE public."Tag" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"environmentId" text NOT NULL,
	CONSTRAINT "Tag_pkey" PRIMARY KEY (id),
	CONSTRAINT "Tag_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Tag_environmentId_idx" ON public."Tag" USING btree ("environmentId");
CREATE UNIQUE INDEX "Tag_environmentId_name_key" ON public."Tag" USING btree ("environmentId", name);

-- public."Webhook" definition

-- Drop table

-- DROP TABLE public."Webhook";

CREATE TABLE public."Webhook" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	url text NOT NULL,
	"environmentId" text NOT NULL,
	triggers public."_PipelineTriggers" NULL,
	"surveyIds" _text NULL,
	"name" text NULL,
	"source" public."WebhookSource" DEFAULT 'user'::"WebhookSource" NOT NULL,
	CONSTRAINT "Webhook_pkey" PRIMARY KEY (id),
	CONSTRAINT "Webhook_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES public."Environment"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Webhook_environmentId_idx" ON public."Webhook" USING btree ("environmentId");


-- public."ContactAttribute" definition

-- Drop table

-- DROP TABLE public."ContactAttribute";

CREATE TABLE public."ContactAttribute" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"attributeKeyId" text NOT NULL,
	"contactId" text NOT NULL,
	value text NOT NULL,
	CONSTRAINT "ContactAttribute_pkey" PRIMARY KEY (id),
	CONSTRAINT "ContactAttribute_attributeKeyId_fkey" FOREIGN KEY ("attributeKeyId") REFERENCES public."ContactAttributeKey"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "ContactAttribute_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ContactAttribute_attributeKeyId_value_idx" ON public."ContactAttribute" USING btree ("attributeKeyId", value);
CREATE UNIQUE INDEX "ContactAttribute_contactId_attributeKeyId_key" ON public."ContactAttribute" USING btree ("contactId", "attributeKeyId");


-- public."Display" definition

-- Drop table

-- DROP TABLE public."Display";

CREATE TABLE public."Display" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"surveyId" text NOT NULL,
	"contactId" text NULL,
	status public."DisplayStatus" NULL,
	"responseId" text NULL,
	CONSTRAINT "Display_pkey" PRIMARY KEY (id),
	CONSTRAINT "Display_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Display_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Display_contactId_created_at_idx" ON public."Display" USING btree ("contactId", created_at);
CREATE UNIQUE INDEX "Display_responseId_key" ON public."Display" USING btree ("responseId");
CREATE INDEX "Display_surveyId_idx" ON public."Display" USING btree ("surveyId");


-- public."ProjectTeam" definition

-- Drop table

-- DROP TABLE public."ProjectTeam";

CREATE TABLE public."ProjectTeam" (
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"projectId" text NOT NULL,
	"teamId" text NOT NULL,
	"permission" public."ProjectTeamPermission" DEFAULT 'read'::"ProjectTeamPermission" NOT NULL,
	CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY ("projectId", "teamId"),
	CONSTRAINT "ProjectTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public."Team"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ProjectTeam_teamId_idx" ON public."ProjectTeam" USING btree ("teamId");


-- public."Response" definition

-- Drop table

-- DROP TABLE public."Response";

CREATE TABLE public."Response" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	finished bool DEFAULT false NOT NULL,
	"surveyId" text NOT NULL,
	"contactId" text NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	meta jsonb DEFAULT '{}'::jsonb NOT NULL,
	"contactAttributes" jsonb NULL,
	"singleUseId" text NULL,
	ttc jsonb DEFAULT '{}'::jsonb NOT NULL,
	"language" text NULL,
	variables jsonb DEFAULT '{}'::jsonb NOT NULL,
	"displayId" text NULL,
	"endingId" text NULL,
	CONSTRAINT "Response_pkey" PRIMARY KEY (id),
	CONSTRAINT "Response_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contact"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Response_displayId_fkey" FOREIGN KEY ("displayId") REFERENCES public."Display"(id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "Response_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES public."Survey"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Response_contactId_created_at_idx" ON public."Response" USING btree ("contactId", created_at);
CREATE UNIQUE INDEX "Response_displayId_key" ON public."Response" USING btree ("displayId");
CREATE INDEX "Response_surveyId_created_at_idx" ON public."Response" USING btree ("surveyId", created_at);
CREATE INDEX "Response_surveyId_idx" ON public."Response" USING btree ("surveyId");
CREATE UNIQUE INDEX "Response_surveyId_singleUseId_key" ON public."Response" USING btree ("surveyId", "singleUseId");


-- public."ResponseNote" definition

-- Drop table

-- DROP TABLE public."ResponseNote";

CREATE TABLE public."ResponseNote" (
	id text NOT NULL,
	created_at timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamp(3) NOT NULL,
	"responseId" text NOT NULL,
	"userId" text NOT NULL,
	"text" text NOT NULL,
	"isEdited" bool DEFAULT false NOT NULL,
	"isResolved" bool DEFAULT false NOT NULL,
	CONSTRAINT "ResponseNote_pkey" PRIMARY KEY (id),
	CONSTRAINT "ResponseNote_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES public."Response"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "ResponseNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ResponseNote_responseId_idx" ON public."ResponseNote" USING btree ("responseId");


-- public."TagsOnResponses" definition

-- Drop table

-- DROP TABLE public."TagsOnResponses";

CREATE TABLE public."TagsOnResponses" (
	"responseId" text NOT NULL,
	"tagId" text NOT NULL,
	CONSTRAINT "TagsOnResponses_pkey" PRIMARY KEY ("responseId", "tagId"),
	CONSTRAINT "TagsOnResponses_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES public."Response"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "TagsOnResponses_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TagsOnResponses_responseId_idx" ON public."TagsOnResponses" USING btree ("responseId");