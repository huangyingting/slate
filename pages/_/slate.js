import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";

import { css } from "@emotion/react";
import { ProcessedText } from "~/components/system/components/Typography";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsitePrototypeHeaderGeneric from "~/components/core/WebsitePrototypeHeaderGeneric";
import WebsitePrototypeFooter from "~/components/core/WebsitePrototypeFooter";
import Slate, { generateLayout } from "~/components/core/Slate";
import SlateMediaObject from "~/components/core/SlateMediaObject";

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  text-align: center;
  font-size: 1rem;
`;

const STYLES_SLATE = css`
  padding: 0 88px 0 88px;
  max-width: 1660px;
  display: block;
  width: 100%;
  margin: 0 auto 0 auto;
  min-height: 10%;
  height: 100%;

  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0 24px 0 24px;
  }
`;

export const getServerSideProps = async (context) => {
  return {
    props: { ...context.query },
  };
};

export default class SlatePage extends React.Component {
  state = {
    layouts: this.props.slate.data.layouts
      ? this.props.slate.data.layouts
      : { lg: generateLayout(this.props.slate.data.objects) },
  };

  componentDidMount() {
    if (!this.props.slate) {
      return null;
    }

    System.dispatchCustomEvent({
      name: "slate-global-create-carousel",
      detail: {
        slides: this.props.slate.data.objects.map((each) => {
          return {
            id: each.id,
            data: each,
            editing: false,
            component: (
              <SlateMediaObject key={each.id} useImageFallback data={each} />
            ),
          };
        }),
      },
    });
  }

  _handleSelect = (index) =>
    System.dispatchCustomEvent({
      name: "slate-global-open-carousel",
      detail: { index },
    });

  render() {
    const title = `${this.props.creator.username}/${
      this.props.slate.slatename
    }`;
    const url = `https://slate.host/${this.props.creator.username}`;
    const description = this.props.slate.data.body;

    const { objects } = this.props.slate.data;

    // TODO(jim): Takes the first image found
    // but we want this to be a user choice.
    let image;
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].type && objects[i].type.startsWith("image/")) {
        image = objects[i].url;
        break;
      }
    }

    const headerTitle = `${this.props.creator.username} / ${
      this.props.slate.slatename
    }`;

    return (
      <WebsitePrototypeWrapper
        title={title}
        description={description}
        url={url}
        image={image}
      >
        <div css={STYLES_ROOT}>
          <WebsitePrototypeHeaderGeneric href={url} title={headerTitle}>
            <ProcessedText text={this.props.slate.data.body} />
          </WebsitePrototypeHeaderGeneric>
          <div css={STYLES_SLATE}>
            <Slate
              editing={false}
              layouts={this.state.layouts}
              items={objects}
              onSelect={this._handleSelect}
            />
          </div>
          <WebsitePrototypeFooter style={{ marginTop: 88 }} />
        </div>
        <System.GlobalCarousel />
      </WebsitePrototypeWrapper>
    );
  }
}
