import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { TripleColumn } from "responsive-react-email";

type Props = {
  baseUrl?: string;
};

export function Footer({ baseUrl }: Props) {
  return (
    <Section className="w-full">
      <Hr />

      <br />

      <Text className="text-[21px] font-regular">
        Earn now. Close later. Secure your future home with us.
      </Text>

      <br />

      <TripleColumn
        pX={0}
        pY={0}
        styles={{ textAlign: "left" }}
        columnOneContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Features</Text>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/bOp4NOx"
              >
                Overview
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/VFcNsmQ"
              >
                Inbox
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/uA06kWO"
              >
                Vault
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/x7Fow9L"
              >
                Tracker
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/fkYXc95"
              >
                Invoice
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/dEnP9h5"
              >
                Pricing
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/E24P3oY"
              >
                Engine
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://loopearn.com/download"
              >
                Download
              </Link>
            </Row>
          </Section>
        }
        columnOneStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
        columnTwoContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Resources</Text>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/fhEy5CL"
              >
                Homepage
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/ZrhEMbR"
              >
                Support
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/rofdWKi"
              >
                Terms of service
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/TJIL5mQ"
              >
                Privacy policy
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/IQ1kcN0"
              >
                Branding
              </Link>
            </Row>

            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/x5ohOs7"
              >
                Feature Request
              </Link>
            </Row>
          </Section>
        }
        columnTwoStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
        columnThreeContent={
          <Section className="text-left p-0 m-0">
            <Row>
              <Text className="font-medium">Company</Text>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/186swoH"
              >
                Story
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/QWyX8Um"
              >
                Updates
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/Dd7M8cl"
              >
                Open startup
              </Link>
            </Row>
            <Row className="mb-1.5">
              <Link
                className="text-[#707070] text-[14px]"
                href="https://go.loopearn.com/M2Hv420"
              >
                OSS Friends
              </Link>
            </Row>
          </Section>
        }
        columnThreeStyles={{ paddingRight: 0, paddingLeft: 0, width: 185 }}
      />

      <br />
      <br />

      <Row>
        <Column className="align-middle w-[40px]">
          <Link href="https://go.loopearn.com/lS72Toq">
            <Img
              src={`${baseUrl}/x.png`}
              width="22"
              height="22"
              alt="loopearn on X"
            />
          </Link>
        </Column>
        <Column className="align-middle w-[40px]">
          <Link href="https://go.loopearn.com/7rhA3rz">
            <Img
              src={`${baseUrl}/producthunt.png`}
              width="22"
              height="22"
              alt="loopearn on Producthunt"
            />
          </Link>
        </Column>

        <Column className="align-middle">
          <Link href="https://go.loopearn.com/Ct3xybK">
            <Img
              src={`${baseUrl}/linkedin.png`}
              width="22"
              height="22"
              alt="loopearn on LinkedIn"
            />
          </Link>
        </Column>
      </Row>

      <br />
      <br />

      <Row>
        <Text className="text-[#B8B8B8] text-xs">
          loopearn LLC - Torsgatan 59 113 37, Stockholm, Sweden.
        </Text>
      </Row>

      <Row>
        <Link
          className="text-[#707070] text-[14px]"
          href="https://app.loopearn.com/settings/notifications"
          title="Unsubscribe"
        >
          Notification preferences
        </Link>
      </Row>

      <br />
      <br />

      <Row>
        <Link href="https://go.loopearn.com/FZwOHud">
          <Img
            src={`${baseUrl}/logo-footer.png`}
            width="100"
            alt="loopearn"
            className="block"
          />
        </Link>
      </Row>
    </Section>
  );
}
